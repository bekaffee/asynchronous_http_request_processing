# Асинхронная обработка HTTP запросов через RabbitMQ

Этот проект демонстрирует механизм асинхронной обработки HTTP запросов с использованием Node.js и RabbitMQ.

## Требования

1. Node.js и npm - установите их с помощью официального сайта Node.js: https://nodejs.org/
2. RabbitMQ - убедитесь, что RabbitMQ установлен на вашем компьютере. Загрузите его с официального сайта: https://www.rabbitmq.com/

## Установка и запуск

1. Склонируйте репозиторий с помощью команды git:

```bash
git clone https://github.com/bekaffee/asynchronous_http_request_processing.git
```

2. Перейдите в каталог проекта:

```bash
cd asynchronous_http_request_processing
```

3. Установите зависимости для обоих микросервисов М1 и М2:

```bash
cd M1
npm install
cd M2
npm install
```

4. Запустите микросервис М1, открыв новое окно терминала и перейдя в его каталог:

```bash
cd M1
node app.js
```

5. Откройте еще одно окно терминала и запустите микросервис М2, перейдя в его каталог:

```bash
cd M2
node worker.js
```


## Тестирование

1. Откройте браузер или инструмент для тестирования API (например, Postman).
2. Отправьте GET запрос на микросервис М1, указав параметр `url`. Например, введите в браузере или Postman:

```bash
GET http://localhost:3000/process?url=https://example.com
```

3. В консоли каждого микросервиса вы должны увидеть вывод, что задание было отправлено в очередь, обработано и результат был возвращен обратно.

4. В браузере или инструменте для тестирования API вы должны увидеть ответ от микросервиса М1, который содержит результат обработки задания из микросервиса М2.
