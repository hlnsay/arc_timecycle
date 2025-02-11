-- server.lua
RegisterServerEvent("timecycle:apply")
AddEventHandler("timecycle:apply", function(timecycle)
    TriggerClientEvent("timecycle:apply", source, timecycle)
end)