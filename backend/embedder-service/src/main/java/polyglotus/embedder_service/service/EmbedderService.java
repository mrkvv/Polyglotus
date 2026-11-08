package polyglotus.embedder_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import polyglotus.embedder_service.dto.GetTopKRequest;
import polyglotus.embedder_service.dto.GetTopKResponse;
import polyglotus.embedder_service.model.Embedding;
import polyglotus.embedder_service.model.Word;
import polyglotus.embedder_service.repository.WordsRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class EmbedderService {
    private static final Logger LOGGER = LoggerFactory.getLogger(EmbedderService.class);

    private static final int BATCH_SIZE = 50;

    private final EmbeddingModel embeddingModel;
    private final WordsRepository wordsRepository;

    public EmbedderService(EmbeddingModel embeddingModel,
                           WordsRepository wordsRepository) {
        this.embeddingModel = embeddingModel;
        this.wordsRepository = wordsRepository;
    }

    public GetTopKResponse getTopK(GetTopKRequest request) {
        float[] dialogEmbed = embeddingModel.embed(request.getDialogContent());
        return GetTopKResponse.from(
                wordsRepository.getTopK(dialogEmbed, request.userId(), request.topK()),
                request.topK()
        );
    }

    @Scheduled(fixedDelay = 30000)
    public void processEmbedding() {
        int processed = fillMissingEmbeddings(BATCH_SIZE);
        if (processed > 0) {
            LOGGER.info("Scheduled embedding fill processed {} words", processed);
        } else {
            LOGGER.info("No words without embeddings found");
        }
    }

    private int fillMissingEmbeddings(int batchSize) {
        List<Word> words = wordsRepository.getWordsWithoutEmbedding(batchSize)
                .stream()
                .map(Word::fromMap)
                .toList();

        if (words.isEmpty()) return 0;

        List<Embedding> forUpdate = new ArrayList<>();
        for (Word word : words) {
            float[] embedding = embeddingModel.embed(word.word());
            forUpdate.add(new Embedding(word.id(), embedding));
        }
        wordsRepository.updateEmbeddingBatch(forUpdate);
        return words.size();
    }
}
