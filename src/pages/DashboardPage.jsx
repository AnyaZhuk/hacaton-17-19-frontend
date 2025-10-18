import CollapsibleStats from '../components/CollapsibleStats';
import TicketColumn from '../components/TicketColumn';
import { AlertIcon, ProcessIcon, CheckIcon } from '../components/Icons';

const mockTicketsNeedsAttention = [ { id: '#82541', category: 'Доступ к ПО', summary: 'Пользователь Сидоров В.А. жалуется на ошибку "Отказано в доступе" при входе в 1С:Бухгалтерия. AI не смог найти пользователя в AD.', userRequest: 'Добрый день. Не могу зайти в 1С, пишет "Отказано в доступе". Раньше всё работало. Мои данные: Сидоров Василий Алибабаевич, таб. номер 778899.', aiAnalysis: { confidence: '35%', reason: 'Пользователь с указанным табельным номером не найден в Active Directory. Требуется ручная проверка данных.', foundArticles: ['Инструкция по первому входу в 1С.pdf'], suggestedAction: 'Проверить корректность табельного номера в HR-системе.' }}, { id: '#82539', category: 'Сетевое оборудование', summary: 'Нестандартный запрос на настройку корпоративного Wi-Fi на личном устройстве (смарт-часы). В базе знаний нет инструкций.', userRequest: 'Привет! Купил себе новые часы Galaxy Watch, не могу подключить их к нашему Wi-Fi "Rosatom_Secure". Помогите настроить.', aiAnalysis: { confidence: '20%', reason: 'Запрос касается личного устройства, не входящего в стандартный перечень поддерживаемого оборудования. Инструкции отсутствуют.', foundArticles: ['Настройка Wi-Fi на корпоративном ноутбуке.docx'], suggestedAction: 'Уточнить у пользователя, является ли устройство корпоративным. Если нет - отказать в поддержке согласно регламенту.' }}, ];
const mockTicketsInProgress = [ { id: '#82544', category: 'Запрос информации', summary: 'Пользователь запрашивает статус заявки #82501 на закупку нового монитора.'}, { id: 'FAKE-1', summary: 'Карточка для скролла 1'}, { id: 'FAKE-2', summary: 'Карточка для скролла 2'}, { id: 'FAKE-3', summary: 'Карточка для скролла 3'}, { id: 'FAKE-4', summary: 'Карточка для скролла 4'} ];
const mockTicketsResolved = [ { id: '#82543', category: 'Сброс пароля', summary: 'Пользователь Иванов И.И. успешно сбросил пароль для входа в корпоративную почту.', userRequest: 'Забыл пароль от почты. Не могу войти. Иванов Иван.', aiAnalysis: { confidence: '98%', reason: 'Стандартный запрос на сброс пароля. Пользователь идентифицирован по email.', foundArticles: ['Инструкция по сбросу пароля.pdf'], executedAction: 'Пароль сброшен. Временный пароль и инструкция отправлены на личную почту, привязанную к аккаунту.', generatedResponse: 'Здравствуйте, Иван Иванович! Ваш пароль для корпоративной почты был сброшен. Временный пароль отправлен на вашу резервную почту.' }}, { id: '#82542', category: 'VPN', summary: 'Пользователю Петрову П.П. предоставлена инструкция по установке и настройке VPN-клиента.', userRequest: 'Не работает впн. Не могу подключиться из дома.', aiAnalysis: { confidence: '92%', reason: 'Типовой запрос на решение проблем с VPN.', foundArticles: ['Установка и настройка VPN.pdf', 'Частые ошибки VPN.docx'], executedAction: 'На почту пользователя отправлена ссылка на актуальную версию VPN-клиента и подробная инструкция по настройке.', generatedResponse: 'Здравствуйте, Петр Петрович! Мы отправили вам на почту подробную инструкцию по установке и настройке VPN. Пожалуйста, следуйте ей. Если проблема сохранится, сообщите нам код ошибки.' }}, ];


function DashboardPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="flex justify-between items-center p-6 shrink-0">
        <h1 className="text-2xl font-bold">Дашборд автоматизации поддержки</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg font-semibold shadow-lg shadow-indigo-500/20 transform transition-transform hover:scale-105 active:scale-95">
          Запустить поток обращений
        </button>
      </header>
      
      <div className="px-6 shrink-0">
        <CollapsibleStats />
      </div>

      <main className="flex-1 flex gap-6 px-6 pb-6 min-h-0">
        <TicketColumn title="Требуется оператор" icon={<AlertIcon />} tickets={mockTicketsNeedsAttention} />
        <TicketColumn title="В обработке AI" icon={<ProcessIcon />} tickets={mockTicketsInProgress} />
        <TicketColumn title="Решено автоматически" icon={<CheckIcon />} tickets={mockTicketsResolved} showAddToKbButton={true} />
      </main>
    </div>
  );
}

export default DashboardPage;