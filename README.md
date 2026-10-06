# Polyglotus

**О проекте:** Данный проект является учебным и выполняется в рамках дисциплины «Технологии разработки качественного программного продукта». Его цель — пройти полный цикл создания качественного программного продукта, следуя всем этапам жизненного цикла разработки ПО: от формализации требований и проектирования архитектуры до реализации и всестороннего тестирования.

**Реализуемый продукт:** Web-приложение по изучению английского языка с интеграцией LLM.

**Функциональные требования проекта:** [доступны по ссылке](https://docs.google.com/document/d/1UzQco7IOTpbXCPvwxdz1yXCSnfAkNRDvYqLAJZM13Og/edit?tab=t.0#heading=h.gy1gldyy9418)

**High Level Design проекта:** [доступен по ссылке](https://github.com/mrkvv/Polyglotus/issues/11)

---
# Технологический стек

### Backend
| Технология | Назначение |
|------------|------------|
| ![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white) | Язык бекенда |
| ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=springboot&logoColor=white) | Фреймворк в основании каждого микросервиса |
| ![Spring AI](https://img.shields.io/badge/Spring_AI-6DB33F?logo=spring&logoColor=white) | Модуль для интеграции с LLM моделями |
| ![Spring JDBC](https://img.shields.io/badge/Spring_JDBC-6DB33F?logo=spring&logoColor=white) | Модуль для работы с РСУБД |
| ![Spring Cloud Gateway](https://img.shields.io/badge/Spring_Cloud_Gateway-6DB33F?logo=spring&logoColor=white) | Реактивный API Gateway |

### Хранение информации
| Технология | Назначение |
|------------|------------|
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) | Основная БД проекта |
| ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white) | Key-Value хранилище кеша, сессий и rate-limit'ов |

### AI
| Технология | Назначение |
|------------|------------|
| ![Ollama](https://img.shields.io/badge/Ollama-000000?logo=ollama&logoColor=white) | Движок для локального запуска LLM |
| ![Qwen](https://img.shields.io/badge/Qwen_2.5-3B%2F7B-6A5ACD?logo=alibabacloud&logoColor=white) | LLM для общения с пользователем |
| ![Sentence Transformers](https://img.shields.io/badge/all--MiniLM--L6--v2-FFD21E?logo=huggingface&logoColor=black) | Модель для эмбеддинга |

### Frontend
| Технология | Назначение |
|------------|------------|
| ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black) | UI-библиотека в основании фронтенда |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white) | Язык фронтенда |
| ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white) | Сборщик и dev-сервер |
| ![React Router](https://img.shields.io/badge/React_Router_DOM-6-CA4245?logo=reactrouter&logoColor=white) | Клиентская маршрутизация |
| ![RTK Query](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?logo=redux&logoColor=white) | Redux Tool Kit - инструмент для работы с данными и HTTP-запросами |

### Стилизация
| Технология | Назначение |
|------------|------------|
| ![Sass](https://img.shields.io/badge/SCSS-Sass_1.x-CC6699?logo=sass&logoColor=white) | Препроцессор стилей |

### Архитектура Frontend'а
| Технология | Назначение |
|------------|------------|
| ![FSD](https://img.shields.io/badge/Feature--Sliced_Design-2C3E50?logo=framework&logoColor=white) | Архитектурная методология |

### DevOps
| Технология | Назначение |
|------------|------------|
| ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) | Платформа контейнеризации |
| ![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white) | Инструмент орекстрации контейнеров |


---
# Команда проекта
|  | Участник | GitHub |
|----------|------|--------|
| <img src="https://github.com/ValentinGolikov.png" width="50" height="50" style="border-radius: 50%;">  | **Голиков Валентин Сергеевич** | [![GitHub](https://img.shields.io/badge/-ValentinGolikov-181717?style=flat&logo=github)](https://github.com/ValentinGolikov) |
| <img src="https://github.com/polinapup.png" width="50" height="50" style="border-radius: 50%;">  | **Калашникова Полина Олеговна** | [![GitHub](https://img.shields.io/badge/-polinapup-181717?style=flat&logo=github)](https://github.com/polinapup) |
| <img src="https://github.com/mrkvv.png" width="50" height="50" style="border-radius: 50%;">  | **Марков Леонид Александрович** | [![GitHub](https://img.shields.io/badge/-mrkvv-181717?style=flat&logo=github)](https://github.com/mrkvv) |
| <img src="https://github.com/Nao2705.png" width="50" height="50" style="border-radius: 50%;">  | **Плужник Анастасия Дмитриевна** | [![GitHub](https://img.shields.io/badge/-Nao2705-181717?style=flat&logo=github)](https://github.com/Nao2705) |




