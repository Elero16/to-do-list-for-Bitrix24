Содержимое архива:
 - index.html
 - app.js
 - style.css
 - manifest.json

Цель:
 Приложение показывает список сделок из CRM (поля ID, TITLE, OPPORTUNITY) и умеет фильтровать по минимальной сумме.

Установка (облако Bitrix24):
1. Открой Bitrix24 → Панель администратора (только если у тебя есть доступ разработчика).
2. Перейди в: Приложения → Ресурсы разработчика (Developer resources) → Другие → Local Application (Локальное приложение).
   (Интерфейс может отличаться — см. документацию по локальным приложениям).
3. Создай новое локальное приложение (тип: Static / Static local app) или выбери Add Local application.
4. В форме добавления укажи:
   - Название: "Список сделок"
   - Стартовая страница: укажи index.html в загружаемом ZIP (если требуется).
   - Разрешения: отметь доступ к CRM (permission: crm / crm.deal.list)
5. Загрузить ZIP:
   - Создай ZIP-архив с файлами index.html, app.js, style.css, manifest.json и загрузи его.
6. Сохранить / Установить приложение.

Запуск и тест:
 - Открой приложение в Bitrix24 (появится в разделе приложений / в слайдере).
 - В поле "Минимальная сумма" укажи число и нажми кнопку "Показать".
 - Приложение отправит запрос `crm.deal.list` и отобразит сделки с OPPORTUNITY > указанной суммы.

Требования:
 - Права доступа аккаунта Bitrix24: доступ к CRM и методам CRM.
 - Приложение рассчитано на запуск внутри Bitrix24 (объект BX24 доступен в окружении).

Отладка:
 - Если видишь сообщение "BX24 API недоступен" — значит ты открыл index.html вне Bitrix24. Загружать и тестировать нужно в окружении портала Bitrix24.

Полезные материалы от Bitrix24:
- Основы работы с Bitrix Framework https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=266&LESSON_ID=25534
- CRM REST API: методы и примеры https://apidocs.bitrix24.ru/api-reference/crm/index.html
- Метод crm.deal.list https://apidocs.bitrix24.ru/api-reference/crm/deals/crm-deal-list.html
- JS SDK Bitrix24 https://dev.1c-bitrix.ru/api_help/js_lib/introduction.php
- Создание локальных приложений для Bitrix24 https://apidocs.bitrix24.ru/local-integrations/local-apps.html
