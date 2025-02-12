document.addEventListener("DOMContentLoaded", function () {
    const menu = document.getElementById("timecycleMenu");
    const timecycleInput = document.getElementById("timecycleInput");
    const dropdownButton = document.getElementById("dropdownButton");
    const timecycleDropdown = document.getElementById("timecycleDropdown");
    let offsetX = 0, offsetY = 0, isDragging = false;

    // Масштабирование интерфейса
    function updateScale() {
        const scaleFactor = window.innerWidth / 1920;
        menu.style.transform = `scale(${scaleFactor})`;
    }

    // Закрытие меню
    window.closeMenu = function() {
        document.body.style.display = "none"; // Скрываем меню
        fetch(`https://${GetParentResourceName()}/closeMenu`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
    };

    // Получение команд от Lua
    window.addEventListener("message", function(event) {
        if (event.data.action === "openMenu") {
            document.body.style.display = "block"; // Показываем меню
        } else if (event.data.action === "hideMenu") {
            document.body.style.display = "none"; // Скрываем меню
        }
    });

    // Закрытие по ESC
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", updateScale);
    updateScale(); // При загрузке страницы

    // Функция для перетаскивания меню
    menu.addEventListener("mousedown", function (e) {
        if (e.target === timecycleInput || e.target === dropdownButton) return;
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
        menu.style.transition = "none";
    });

    document.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        requestAnimationFrame(() => {
            menu.style.left = `${e.clientX - offsetX}px`;
            menu.style.top = `${e.clientY - offsetY}px`;
        });
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
        menu.style.transition = "top 0.15s ease-out, left 0.15s ease-out";
    });

    document.addEventListener("dragstart", (e) => e.preventDefault());

    // Переключение списка при клике на стрелку ▼
    dropdownButton.addEventListener("click", function () {
        timecycleDropdown.classList.toggle("show");
    });

    // Выбор таймцикла из списка
    window.selectTimecycle = function(timecycle) {
        timecycleInput.value = timecycle;
        timecycleDropdown.classList.remove("show"); // Закрываем список
    };

    // Закрытие списка при клике вне его
    document.addEventListener("click", function (event) {
        if (!dropdownButton.contains(event.target) && !timecycleDropdown.contains(event.target)) {
            timecycleDropdown.classList.remove("show");
        }
    });

    // Отправка названия таймцикла в Lua
    window.applyTimecycle = function() {
        const timecycleName = timecycleInput.value.trim();

        if (timecycleName) {
            fetch(`https://${GetParentResourceName()}/applyTimecycle`, {
                method: 'POST',
                body: JSON.stringify({ timecycle: timecycleName })
            }).then(response => {
                if (response.ok) {
                    console.log("Timecycle applied: " + timecycleName);
                }
            });

            timecycleInput.value = ''; // Очищаем поле ввода
        } else {
            console.log("Введите название таймцикла");
        }
    };

    // Очистка таймцикла
    window.clearTimecycle = function() {
        fetch(`https://${GetParentResourceName()}/clearTimecycle`, {
            method: 'POST',
            body: JSON.stringify({})
        }).then(response => {
            if (response.ok) {
                console.log("Timecycle cleared");
            }
        });
    };
});