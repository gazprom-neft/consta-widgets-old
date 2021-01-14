# GPN Components
Репозиторий компонентов и графиков

NPM: https://www.npmjs.com/package/@consta/widgets

## Использование

### Установка

Установка пакета:

```sh
# NPM
$ npm i @consta/widgets

# Yarn
$ yarn add @consta/widgets
```

### Зависимости

Для работы пакета необходимо установить библиотеку [`@consta/uikit`](https://www.npmjs.com/package/@consta/uikit) и [настроить тему](https://consta-uikit.vercel.app/?path=/docs/components-theme--playground).


### Использование компонентов

Пример импорта компонента:

```js
import { BarChart } from '@consta/widgets/Barchart'
```

## Разработка

### Подготовка окружения

Рабочее окружение должно содержать NodeJS и Yarn, необходимые версии можно узнать в файле [package.json](./package.json) в блоке **engines**.

Для установки зависимостей следует выполнить команду:

```sh
$ yarn install
```

### Публикация

Способы публикации новой версии пакета в npm описаны в разделе документации [Обновление версии и публикация пакета](https://consta-widgets-old.vercel.app/?path=/docs/документация-обновление-версии-и-публикация-пакета--page).

### Основные команды

```sh
# Сборка и старт Storybook
$ yarn storybook

# Сборка для production
$ yarn run build

# Линтинг всех файлов
$ yarn run lint

# Форматирование всех файлов prettier
$ yarn run format

# Запуск тестов
$ yarn run unit

# Запуск тестов и линтинг файлов
$ yarn test
```

## Документация

См. [раздел «Документация»](https://consta-widgets-old.vercel.app/?path=/docs/документация-договоренности-по-оформлению-кода--page) в Storybook.
