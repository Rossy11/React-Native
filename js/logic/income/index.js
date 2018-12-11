/**
 * Created by fy on 2018/4/20.
 */
import { MerchantDayIncome, StoreDayIncome, MachineDayIncome } from '../../model/income'
export function jsonToMerchantDaysIncome(jsonObj) {
    console.log(jsonObj)
    // 代理日总收入集合
    let merchantDaysIncome = []

    for (var year in jsonObj) {
        let yearValue = jsonObj[year]
        for (var month in yearValue) {
            let monthValue = yearValue[month]


            for (var day in monthValue["days"]) {
                let date = `${year}-${month}-${day}`
                let dayValue = monthValue["days"][day]

                // 代理单日收入
                let merchantOneDayIncome = new MerchantDayIncome()
                merchantOneDayIncome.date = date
                merchantOneDayIncome.all_income = dayValue.all_income
                merchantOneDayIncome.machinesDayIncome = []
                merchantDaysIncome.push(merchantOneDayIncome)

                // 代理单日 storesDayIncomes
                let storesDayIncome = []
                merchantOneDayIncome.storesDayIncome = storesDayIncome

                let stores = dayValue["store"]
                for (var storeId in stores) {
                    let storeInfo = stores[storeId]

                    // store 单日收入
                    let storeOneDayIncome = new StoreDayIncome()
                    storeOneDayIncome.date = date
                    storeOneDayIncome.storeid = storeInfo.storeid
                    storeOneDayIncome.income = storeInfo.income
                    storeOneDayIncome.storename = storeInfo.storename
                    storeOneDayIncome.is_defaultgroup = storeInfo.is_defaultgroup
                    storesDayIncome.push(storeOneDayIncome)

                    // store's machinesDayIncome
                    let machinesDayIncome = []
                    storeOneDayIncome.machinesDayIncome = machinesDayIncome

                    let mids = storeInfo["mids"]
                    mids.forEach((machine) => {

                        let machineDayIncome = new MachineDayIncome(machine.machine_name, machine.mid, machine.mid_income, date);
                        machinesDayIncome.push(machine)
                        merchantOneDayIncome.machinesDayIncome.push(machine)
                    })

                }
            }

        }
    }

    return merchantDaysIncome

}