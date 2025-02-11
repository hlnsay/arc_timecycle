local activeTimecycle = nil

-- Команда установки таймцикла
RegisterCommand("settimecycle", function(source, args, rawCommand)
    if #args < 1 then
        print("Usage: /settimecycle <timecycle_name>")
        return
    end

    local timecycle = args[1]
    Citizen.InvokeNative(0xFA08722A5EA82DA7, timecycle) -- SET_TIMECYCLE_MODIFIER
    Citizen.InvokeNative(0xFDB74C9CC54C3F37, 1.0) -- SET_TIMECYCLE_MODIFIER_STRENGTH
    activeTimecycle = timecycle

    print("Applied timecycle: " .. timecycle)
end, false)

-- Команда очистки таймцикла
RegisterCommand("cleartimecycle", function()
    Citizen.InvokeNative(0x0E3F4AF2D63491FB) -- CLEAR_TIMECYCLE_MODIFIER
    activeTimecycle = nil
    print("Timecycle cleared")
end, false)

-- Функция для открытия/закрытия меню
function toggleTimecycleMenu()
    local nuiStatus = not IsNuiFocused()
    SetNuiFocus(nuiStatus, nuiStatus) -- Включает/выключает фокус и курсор
    SendNUIMessage({ action = nuiStatus and "openMenu" or "hideMenu" }) -- Отправка в UI
end

-- Команда открытия меню
RegisterCommand("timecyclesearch", function()
    toggleTimecycleMenu()
end, false)

-- Обработка закрытия через NUI
RegisterNUICallback("closeMenu", function(data, cb)
    SetNuiFocus(false, false)
    SendNUIMessage({ action = "hideMenu" })
    cb("ok")
end)

-- Обработка применения таймцикла через NUI
RegisterNUICallback("applyTimecycle", function(data, cb)
    local timecycle = data.timecycle

    if timecycle and timecycle ~= "" then
        Citizen.InvokeNative(0xFA08722A5EA82DA7, timecycle) -- SET_TIMECYCLE_MODIFIER
        Citizen.InvokeNative(0xFDB74C9CC54C3F37, 1.0) -- SET_TIMECYCLE_MODIFIER_STRENGTH
        activeTimecycle = timecycle
        print("Applied timecycle: " .. timecycle)
    end

    cb("ok")
end)

-- Обработка очистки таймцикла через NUI
RegisterNUICallback("clearTimecycle", function(_, cb)
    Citizen.InvokeNative(0x0E3F4AF2D63491FB) -- CLEAR_TIMECYCLE_MODIFIER
    activeTimecycle = nil
    print("Timecycle cleared")
    cb("ok")
end)

-- Открытие меню по клавише 7 (0xB03A913B)
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if IsControlJustReleased(0, 0xB03A913B) then -- Клавиша 7
            toggleTimecycleMenu()
        end
    end
end)
