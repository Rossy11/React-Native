/**
 * Created by fy on 2018/4/8.
 */

const BASE_URL = "xxx",
    // 根据机器mid筛选时间段消费详情
    URL_MACHINE_SERIAL_CONSUME = "xxx/machinedetailconsume/?mid=3&pay_time_0=2018-04-01&pay_time_1=2018-04-04",
    // 商户一段时间收入详情，到机器日收入
    URL_MERCHANT_SERIAL_CONSUME = "xxx/storereport/?merchantid=3&datetime_0=2018-03-27&datatime_1=2018-04-04";


const LYAPIS = {};

/* Test ==============================*/
LYAPIS.aa = (aa,bb, failure, success) => {
    return aa+bb;
}


LYAPIS.aa = (aa, bb, failure1, success1) => {
    if(aa === "aa") {
        failure1(aa)
    }else {
        success1(bb)
    }
}

LYAPIS.aa("aa", "bb", (a) => {
    console.log("failure--", a);
}, (b) => {
    console.log("success--",b);
});

/* 门店列表=====================*/
LYAPIS.getShops = () => {
    try {
        let response = await fetch("xxx/center/merchant/?cmd=query_store_info&merchantid=3")
        let json = await response.json()
        console.log(json, response);

    } catch (error) {

    }
}

LYAPIS.getShops()