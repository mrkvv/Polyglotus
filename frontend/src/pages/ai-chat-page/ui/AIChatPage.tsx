import { useState, useRef, useEffect, useCallback } from 'react';
import { Typography, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  useSendMessageMutation,
  useGetMessageHistoryQuery,
  useGetHelloMessageQuery,
  useDeleteChatMutation,
} from '../api/aiChatApi';
import type { Message } from '../model/types';
import './AIChatPage.scss';

const MAX_LENGTH = 256;

function isContextOverflow(e: unknown): boolean {
  const data = (e as { data?: { error?: string } })?.data;
  return data?.error === 'CONTEXT_OVERFLOW';
}

function isModelExhausted(e: unknown): boolean {
  const data = (e as { data?: { error?: string } })?.data;
  return data?.error === 'MODEL_CONTEXT_EXHAUSTED';
}

export function AIChatPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [contextOverflow, setContextOverflow] = useState(false);
  const [modelExhausted, setModelExhausted] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: historyData, isLoading: historyLoading } = useGetMessageHistoryQuery();
  const { data: helloData, isLoading: helloLoading } = useGetHelloMessageQuery();
  const [sendMessage] = useSendMessageMutation();
  const [deleteChat, { isLoading: isDeleting }] = useDeleteChatMutation();

  const historyMessages = historyData?.messages ?? [];

  const allMessages: Message[] = [
    ...historyMessages,
    ...optimisticMessages.filter(
      (opt) => !historyMessages.some((h) => h.id === opt.id)
    ),
  ];

  const hasHistory = historyMessages.length > 0;
  const chatBlocked = contextOverflow || modelExhausted;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_LENGTH) return;
    setInput(value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || isSending || chatBlocked) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsSending(true);

    const tempId = Date.now();
    const userMsg: Message = {
      id: tempId,
      userId: 0,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setOptimisticMessages((prev) => [...prev, userMsg]);

    try {
      await sendMessage({ content }).unwrap();
      setOptimisticMessages([]);
    } catch (e) {
      setOptimisticMessages([]);
      if (isContextOverflow(e)) {
        setContextOverflow(true);
      } else if (isModelExhausted(e)) {
        setModelExhausted(true);
      }
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, chatBlocked, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeleteConfirm = async () => {
    setConfirmOpen(false);
    await deleteChat().unwrap();
    setContextOverflow(false);
    setModelExhausted(false);
    setOptimisticMessages([]);
  };

  const isLoading = historyLoading || helloLoading;
  const canSend = input.trim().length > 0 && !isSending && !chatBlocked;

  return (
    <div className="AIChatPage">
      <div className="AIChatPage__Header">
        <button
          className="AIChatPage__EndBtn"
          onClick={() => setConfirmOpen(true)}
          disabled={isDeleting || (!hasHistory && !chatBlocked)}
        >
          <Typography variant="body2">{t('chat_end_dialog')}</Typography>
          <RefreshIcon fontSize="small" />
        </button>
      </div>

      <div className="AIChatPage__Messages">
        {isLoading && (
          <div className="AIChatPage__Loader">
            <CircularProgress size={32} />
          </div>
        )}

        {!isLoading && (
          <>
            {helloData && (
              <div className="AIChatPage__Message AIChatPage__Message--ai">
                <div className="AIChatPage__Bubble AIChatPage__Bubble--ai">
                  <div className="AIChatPage__Markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {helloData.helloMessage}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {allMessages.map((msg) => (
              <div
                key={msg.id}
                className={`AIChatPage__Message AIChatPage__Message--${msg.role === 'user' ? 'user' : 'ai'}`}
              >
                <div className={`AIChatPage__Bubble AIChatPage__Bubble--${msg.role === 'user' ? 'user' : 'ai'}`}>
                  {msg.role === 'user' ? (
                    <Typography variant="body1">{msg.content}</Typography>
                  ) : (
                    <div className="AIChatPage__Markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="AIChatPage__Message AIChatPage__Message--ai">
                <div className="AIChatPage__Bubble AIChatPage__Bubble--ai AIChatPage__Bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {contextOverflow && (
              <div className="AIChatPage__Message AIChatPage__Message--ai">
                <div className="AIChatPage__Bubble AIChatPage__Bubble--overflow">
                  <Typography variant="body2">{t('chat_context_overflow')}</Typography>
                </div>
              </div>
            )}

            {modelExhausted && (
              <div className="AIChatPage__Message AIChatPage__Message--ai">
                <div className="AIChatPage__Bubble AIChatPage__Bubble--overflow">
                  <Typography variant="body2">{t('chat_model_exhausted')}</Typography>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="AIChatPage__InputArea">
        <div className="AIChatPage__InputWrapper">
          <textarea
            ref={textareaRef}
            className="AIChatPage__Input"
            placeholder={t('chat_placeholder')}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={chatBlocked}
          />
          <div className="AIChatPage__InputMeta">
            <Typography variant="caption" className="AIChatPage__CharCount">
              {t('chat_char_limit', { count: input.length })}
            </Typography>
            <IconButton
              className="AIChatPage__SendBtn"
              onClick={handleSend}
              disabled={!canSend}
              size="small"
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', padding: '8px', minWidth: 320 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18, textAlign: 'center', pb: 0 }}>
          {t('chat_confirm_end_title')}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pt: '8px !important', pb: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {t('chat_confirm_end_subtitle')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 2, pt: 2 }}>
          <Button
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            sx={{ color: '#2E7D32', fontWeight: 700, letterSpacing: '0.05em' }}
          >
            {t('chat_confirm_end_yes')}
          </Button>
          <Button
            onClick={() => setConfirmOpen(false)}
            color="inherit"
            sx={{ fontWeight: 400, letterSpacing: '0.05em' }}
          >
            {t('chat_confirm_end_no')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
