import { useState, useRef, useEffect, useCallback } from 'react';
import { Typography, IconButton, CircularProgress } from '@mui/material';
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

export function AIChatPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [contextOverflow, setContextOverflow] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
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
    if (!content || isSending || contextOverflow) return;

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
      }
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, contextOverflow, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async () => {
    await deleteChat().unwrap();
    setContextOverflow(false);
    setOptimisticMessages([]);
  };

  const isLoading = historyLoading || helloLoading;
  const canSend = input.trim().length > 0 && !isSending && !contextOverflow;

  return (
    <div className="AIChatPage">
      <div className="AIChatPage__Header">
        <button
          className="AIChatPage__EndBtn"
          onClick={handleDelete}
          disabled={isDeleting || (!hasHistory && !contextOverflow)}
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

            {/* История */}
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

            {/* Typing-индикатор */}
            {isSending && (
              <div className="AIChatPage__Message AIChatPage__Message--ai">
                <div className="AIChatPage__Bubble AIChatPage__Bubble--ai AIChatPage__Bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {/* Переполнение контекста (F_Chat_11/13) */}
            {contextOverflow && (
              <div className="AIChatPage__Message AIChatPage__Message--ai">
                <div className="AIChatPage__Bubble AIChatPage__Bubble--overflow">
                  <Typography variant="body2">{t('chat_context_overflow')}</Typography>
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
            disabled={contextOverflow}
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
    </div>
  );
}
