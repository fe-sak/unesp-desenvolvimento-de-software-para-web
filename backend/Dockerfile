FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

COPY gradlew gradlew.bat build.gradle settings.gradle ./
COPY gradle ./gradle

RUN chmod +x gradlew

COPY src ./src

RUN ./gradlew --no-daemon bootJar

FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=build /app/build/libs/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

FROM eclipse-temurin:21-jdk-alpine AS dev

WORKDIR /workspace/backend

RUN apk add --no-cache curl

COPY gradlew gradlew.bat build.gradle settings.gradle ./
COPY gradle ./gradle
COPY src ./src

RUN chmod +x gradlew && ./gradlew --no-daemon testClasses

EXPOSE 8080

CMD ["./gradlew", "bootRun", "--continuous"]
