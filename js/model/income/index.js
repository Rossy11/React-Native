/**
 * Created by fy on 2018/4/16.
 */

export class MachineDayIncome {
    constructor(machine_name, mid, mid_income, date) {
        this.machine_name = machine_name
        this.mid = mid
        this.mid_income = mid_income
        this.date = date
    }
}

export class StoreDayIncome {
    constructor(storeid, is_defaultgroup, income, mids, storename, date) {
        this.storeid = storeid
        this.is_defaultgroup = is_defaultgroup
        this.income = income
        this.mids = mids
        this.storename = storename
        this.date = date
    }
}

export class MerchantDayIncome {
    constructor(date, all_income, storesDayIncome, machinesDayIncome) {
        this.date = date
        this.all_income = all_income
        this.storesDayIncome = storesDayIncome
        this.machinesDayIncome = machinesDayIncome
    }
}
