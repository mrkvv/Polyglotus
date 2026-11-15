import { useEffect, useState } from 'react';
import {
  Paper, Typography, List, ListItemButton, ListItemText,
  Divider, Button, Box, CircularProgress,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { CatalogTranslationItem, UserDictionaryItem, GetTranslationsResponse } from '../model/types';

const CATALOG_PREVIEW_LIMIT = 2;

interface SearchDropdownProps {
  word: string;
  data: GetTranslationsResponse | undefined;
  isLoading: boolean;
  /** Ключ: "word|variant|part_of_speech" */
  pendingIds: Set<string>;
  onAdd: (variant: string, partOfSpeech: string, word: string) => void;
  onManual: () => void;
}

// Вспомогательный компонент — группа переводов из каталога
function CatalogGroup({
  item,
  word,
  pendingIds,
  onAdd,
}: {
  item: CatalogTranslationItem;
  word: string;
  pendingIds: Set<string>;
  onAdd: (variant: string, partOfSpeech: string, word: string) => void;
}) {
  return (
    <Box>
      {/* Заголовок группы: тема + часть речи */}
      <Box sx={{ px: 2, pt: 1, pb: 0.5, display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {item.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {item.part_of_speech}
        </Typography>
      </Box>
      <Divider sx={{ mx: 2 }} />

      {/* Варианты перевода — каждый кликабелен */}
      <List disablePadding>
        {item.variants_of_words.map((variant) => {
          const key = `${word}|${variant}|${item.part_of_speech}`;
          const isPending = pendingIds.has(key);
          return (
            <ListItemButton
              key={variant}
              onClick={() => !isPending && onAdd(variant, item.part_of_speech, word)}
              disabled={isPending}
              sx={{
                py: 0.75,
                px: 3,
                '&:hover': { backgroundColor: 'action.hover' },
                '&:hover .add-hint': { opacity: 1 },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary">
                    {variant}
                  </Typography>
                }
              />
              <Box
                className="add-hint"
                sx={{
                  opacity: 0,
                  transition: 'opacity 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isPending ? (
                  <CircularProgress size={14} />
                ) : (
                  <Typography variant="caption" color="success.main" fontWeight={600}>
                    + добавить
                  </Typography>
                )}
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

// Вспомогательный компонент — уже добавленное слово: просто en — ru
function UserGroup({ item, word }: { item: UserDictionaryItem; word: string }) {
  return (
    <Box sx={{ px: 2, py: 0.75, display: 'flex', alignItems: 'baseline', gap: 1 }}>
      <Typography variant="body2" color="text.primary">
        {word}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        - {item.ru}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {item.partOfSpeech}
      </Typography>
    </Box>
  );
}

export function SearchDropdown({
  word,
  data,
  isLoading,
  pendingIds,
  onAdd,
  onManual,
}: SearchDropdownProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [word]);

  if (isLoading) {
    return (
      <Paper elevation={3} sx={paperSx}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      </Paper>
    );
  }

  if (!data) return null;

  const { inUserDictionary, inCatalog } = data;
  const hasAdded = inUserDictionary.length > 0;
  const hasCatalog = inCatalog.length > 0;
  const nothingFound = !hasAdded && !hasCatalog;

  // Скролл нужен всегда когда групп больше лимита — чтобы размер не прыгал при раскрытии
  const needsScroll = inCatalog.length > CATALOG_PREVIEW_LIMIT;
  const showExpandBtn = !expanded && inCatalog.length > CATALOG_PREVIEW_LIMIT;
  const visibleCatalog = expanded ? inCatalog : inCatalog.slice(0, CATALOG_PREVIEW_LIMIT);

  return (
    <Paper elevation={3} sx={paperSx}>
      {/* ── Скроллируемая зона ── */}
      <Box sx={needsScroll ? scrollAreaSx : undefined}>

        {/* Ничего не найдено */}
        {nothingFound && (
          <Box sx={{ px: 2, py: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              Перевод не найден
            </Typography>
          </Box>
        )}

        {/* ── Секция: Добавленные ── */}
        {hasAdded && (
          <Box>
            <Typography variant="overline" sx={sectionTitleSx}>
              Добавленные
            </Typography>
            {inUserDictionary.map((item) => (
              <UserGroup key={item.id} item={item} word={word} />
            ))}
          </Box>
        )}

        {hasAdded && hasCatalog && <Divider />}

        {/* ── Секция: Не добавленные ── */}
        {hasCatalog && (
          <Box>
            <Typography variant="overline" sx={sectionTitleSx}>
              Не добавленные
            </Typography>
            {visibleCatalog.map((item, i) => (
              <CatalogGroup
                key={i}
                item={item}
                word={word}
                pendingIds={pendingIds}
                onAdd={onAdd}
              />
            ))}

            {showExpandBtn && (
              <Button
                size="small"
                onClick={() => setExpanded(true)}
                sx={{
                  mx: 2,
                  mb: 1,
                  color: 'success.main',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  '&:hover': { backgroundColor: 'transparent', color: 'success.dark' },
                }}
              >
                КО ВСЕМ ПЕРЕВОДАМ
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* ── Футер ── */}
      <Divider />
      <Box sx={{ px: 2, py: 1.25 }}>
        <Button
          size="small"
          startIcon={<EditOutlinedIcon fontSize="small" />}
          onClick={onManual}
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            fontSize: '13px',
            textTransform: 'none',
            p: 0,
            '&:hover': { backgroundColor: 'transparent', color: 'text.primary' },
          }}
        >
          Добавить слово вручную?
        </Button>
      </Box>
    </Paper>
  );
}

// ── Стили ────────────────────────────────────────────────

const paperSx = {
  position: 'absolute' as const,
  top: 'calc(100% + 8px)',
  right: 0,
  width: 400,
  zIndex: 100,
  borderRadius: '12px',
  overflow: 'hidden',
};

const scrollAreaSx = {
  maxHeight: 550,
  overflowY: 'auto' as const,
  '&::-webkit-scrollbar': { width: '4px' },
  '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: '4px' },
};

const sectionTitleSx = {
  display: 'block',
  px: 2,
  pt: 1.5,
  pb: 0.5,
  fontSize: '11px',
  fontWeight: 700,
  color: 'text.secondary',
  letterSpacing: '0.08em',
};
