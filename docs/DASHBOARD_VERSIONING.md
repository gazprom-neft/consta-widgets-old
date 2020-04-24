# Версионирование дашбордов

В случае, когда меняется формат данных дашборда (например, изменяется название какого-то поля или добавляется новое), нужно завести новую версию дашборда и добавить миграцию.

## Типизация
Процесс обновления типов:
1. Создать новую миграцию, [подробнее в главе "Миграции"](#миграции);
1. Добавить новые типы в namespace. Если добавляются какие-то новые типы, влияющие на тип стэйта дашборда, нужно добавить их в нэймспэйс этого дашборда, а потом реэкспортнуть в [src/dashboard/types.ts](src/dashboard/types.ts) (по аналогии с реэкспортом `Settings` или `MarginSize`).

За исключением папки миграций и [src/dashboard/types.ts](src/dashboard/types.ts) нигде не должно быть прямых импортов типов из отдельных версий дашборда. Все импорты типов, связанные со стэйтом дашборда, должны быть из файла [src/dashboard/types.ts](src/dashboard/types.ts).

## Миграции
Чтобы создать новую миграцию, нужно:
1. Запустить скрипт с помошью команд `yarn migration:create` или `npm run migration:create`;
1. Обновить новую миграцию в [файле](src/dashboard/migration/migrations/current/index.ts):
    * добавить/изменить необходимые типы;
    * обновить метод `up` (функция повышения версии с предыдущей);
    * обновить метод `down` (функция понижения версии до предыдущей).
1. Обновить тесты для новой миграции в [файле](src/dashboard/migration/migrations/current/__tests__/index.ts).

### Причины
Изменения, после которых **нужно** писать миграцию:
- Изменения, касающиеся параметров виджета:
    - Переименовался параметр
    - Параметр стал обязательным для заполнения
    - Изменился набор вариантов для существующего параметра
    - Добавился новый параметр (при миграции вверх ничего не надо делать, а при миграции вниз удалить его)
    - Удалился параметр (при миграции вверх надо его удалить, а при миграции вниз вернуть)
- Изменения, касающиеся конфига кастомного виджета
- Изменения, касающиеся конфига дашборда
- Удалился виджет (при миграции вверх нужно удалить его из конфигов)
- Добавился новый виджет (при миграции вниз нужно его удалить)

Изменения, после которых **не нужно** писать миграцию:
- Изменилось дефолтное значение параметра
- У виджета изменился формат данных
- Изменился визуальный ряд: цвет/размер шрифта/размер отступов

## Интерфейс
Поведение отличается в зависимости от режима (просмотр / редактирование) и версии переданного дашборда. 

* Если версия переданного дашборда выше текущей поддерживаемой, то отображается ошибка. Это значит, что дашборд был создан на клиенте более новой версии. На старой версии клиента мы такой дашборд открыть не можем.
* Если версия переданного дашборда ниже:
    * В режиме просмотря дашборд обновляется до последней версии без предупреждения и отображается пользователю. `onChange` в таком случае не должен дёргаться, т.е. на бэке версия дашборда остаётся старой и обновляется на клиенте при каждом открытии.
    * В режиме редактирования отображается предупреждение с предложением обновить версию. По нажатию на кнопку «Обновить» дёрнется `onChange` с обновлённой версией, благодаря чему изменение будет сохранено на бэке.
    
Дополнительно в режиме редактирования можно понизить версию — для этого нужно в левом меню выбрать версию ниже и согласиться с предупреждением.
    