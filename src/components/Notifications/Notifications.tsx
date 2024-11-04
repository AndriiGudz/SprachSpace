import { ToastContainer } from "react-toastify"
// Импортируем стили React-Toastify
import "react-toastify/dist/ReactToastify.css"

function Notifications() {
  return (
    <div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false} // Отключить паузу при потере фокуса
        draggable={false} // Отключить возможность перетаскивания
        // pauseOnHover={false} // Отключить паузу при наведении мыши
        pauseOnHover
        limit={3} // Ограничение на количество уведомлений одновременно
        // icon={false} // Убирает иконку по умолчанию
      />
    </div>
  )
}

export default Notifications
