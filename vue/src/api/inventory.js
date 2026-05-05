import { myrequest } from "./request"

export const api_inventory_showReagent = (params = {}) => {
    return myrequest.get('/stock/inventory/showReagent', {
        name: params.name,
        lowStockOnly: params.lowStockOnly,
        page: params.page,
        pageSize: params.pageSize,
    })
}

export const api_inventory_showLot = (params = {}) => {
    return myrequest.get('/stock/inventory/showLot', {
        reagentId: params.reagentId,
        lot: params.lot,
        expiredOnly: params.expiredOnly,
        page: params.page,
        pageSize: params.pageSize,
    })
}

export const api_inventory_showAll = (params = {}) => {
  return myrequest.get('/stock/inventory/showAll', {
    lot: params.lot,
    page: params.page,
    pageSize: params.pageSize,
  })
}

