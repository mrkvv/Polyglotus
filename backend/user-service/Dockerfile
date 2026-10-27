FROM gradle:8.14-jdk21 AS build
WORKDIR /app

COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src ./src

RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar
CMD ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]