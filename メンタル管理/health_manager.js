
//localStorageへ保存
const form_save = document.querySelector("#form_save");
form_save.addEventListener("click", () => {

//フォームから値を取り出す
const weather = document.querySelector("#weather");
const wakeup_hour = document.querySelector("#wakeup_hour");
const wakeup_minute = document.querySelector("#wakeup_minute");
const sleep_hour = document.querySelector("#sleep_hour");
const sleep_minute = document.querySelector("#sleep_minute");
const meal_time = document.querySelector("#meal_time");
const taking_medication = document.querySelector("#taking_medication");
const today_event = document.querySelector("#today_event");
const troublesome_event = document.querySelector("#troublesome_event");
const motion = document.querySelector("[name='motion']:checked");


//日付を取得
let date = document.querySelector("#date").value;

// 取得できない場合は今日の日付を取得
if (!date){
    //指定されていなかった場合、今日の日付を作る
    const today   = new Date();
    const year    = String(today.getFullYear());
    const month   = ("0" + String(today.getMonth() + 1) ).slice(-2);
    const day     = ("0" + String(today.getDate()) ).slice(-2);

    date    = year + "-" + month + "-" + day;

}

// オブジェクトを作り、ローカルストレージに記録をする。
const obj = {};
obj.date                = date;
obj.weather             = weather.textContent;
obj.wakeup_hour         = wakeup_hour.value; 
obj.wakeup_minute       = wakeup_minute.value; 
obj.sleep_hour          = sleep_hour.value; 
obj.sleep_minute        = sleep_minute.value; 
obj.meal_time           = meal_time.value; 
obj.taking_medication   = taking_medication.value; 
obj.today_event         = today_event.value; 
obj.troublesome_event   = troublesome_event.value; 
obj.motion              = motion.value; 
obj.date                = date;
// TODO:天気予報のデータもオブジェクトに追加する
    
    







console.log(obj);

// この1日分のオブジェクト(obj)を文字列型に変換する。
console.log( JSON.stringify(obj) );

// localStorageを使って記録する。
// .setItem(キー, 値) で 記録ができる。
localStorage.setItem(date, JSON.stringify(obj));

/*
console.log("=====================")
// 記録したlocalStorageを取り出す。
console.log( localStorage.getItem(date) );
// 文字列型のデータをオブジェクトに変換する
console.log( JSON.parse(localStorage.getItem(date)) );
*/

})

// #excel_output をクリックした時にイベントを
const excel_output = document.querySelector("#excel_output");
excel_output.addEventListener("click", () => {
    // localStorageからデータを取り出し、二次元配列をつくる。

    // localStorageに記録された全てのデータを取り出す。

    const data  = [];

    const label = [];

    label.push("日付"); 
    label.push("天気");
    label.push("起床時間(時)"); 
    label.push("起床時間(分)"); 
    label.push("就寝時間(時)"); 
    label.push("就寝時間(分)"); 
    label.push("食事回数"); 
    label.push("服薬"); 
    label.push("今日の出来事"); 
    label.push("困った出来事"); 
    label.push("今日の気分"); 

    data.push(label);

    //ローカルストレージからデータを取得して、日付を昇順にソートする
    const rows = [];

    for (let i=0; i<localStorage.length; i++ ){
        const key       = localStorage.key(i);
        console.log(key);

        const obj       = JSON.parse(localStorage.getItem(key))
        console.log( obj );

        const row = [];
        
        row.push(obj.date             ); 
        row.push(obj.weather          );
        row.push(obj.wakeup_hour      ); 
        row.push(obj.wakeup_minute    ); 
        row.push(obj.sleep_hour       ); 
        row.push(obj.sleep_minute     ); 
        row.push(obj.meal_time        ); 
        row.push(obj.taking_medication); 
        row.push(obj.today_event      ); 
        row.push(obj.troublesome_event); 
        row.push(obj.motion           ); 

        rows.push(row);

    }

    //日付を昇順にソート
    rows.sort((a, b) => {
        const dateA = new Date(a[0]);//日付の配列は最初の要素にある
        const dateB = new Date(b[0]);
        return dateA - dateB;//昇順にソート
    });

    //ソート後の行をdata配列に追加
    data.push(...rows);


    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();

    // エクセルファイル名用の今日の日付
    const today   = new Date();
    const year    = String(today.getFullYear());
    const month   = ("0" + String(today.getMonth() + 1) ).slice(-2);
    const day     = ("0" + String(today.getDate()) ).slice(-2);
    const date    = year + "-" + month + "-" + day;


    // エクセルブックにシートを追加して保存する。
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${date}.xlsx`);




    

    /*

    // 2次元配列を作る。
    const data  = [];
    for (let i=0 ; i<1 ; i++ ){

        const row = [];

        row.push(wakeup_hour.value      ); 
        row.push(wakeup_minute.value    ); 
        row.push(sleep_hour.value       ); 
        row.push(sleep_minute.value     ); 
        row.push(meal_time.value        ); 
        row.push(taking_medication.value); 
        row.push(today_event.value      ); 
        row.push(troublesome_event.value); 
        row.push(motion.value           ); 

        data.push(row);
    }



        // アノテーション 「TODO:」 の書き方。FIXME: でコード修正の表現。
    // TODO: sheet.jsを使って、エクセルファイルをDLする。

    // 2次元配列からエクセルのシートを作り、シートからブックを作ってDL
    // https://docs.sheetjs.com/docs/api/utilities/array
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();

    // エクセルブックにシートを追加して保存する。
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${date}.xlsx`);

*/



})

const prefectureSelect = document.getElementById("prefecture");
const citySelect = document.getElementById("city");

// 都道府県のデータを取得
fetch("https://www.jma.go.jp/bosai/common/const/area.json")
    .then(response => response.json())
    .then(data => {

        // 都道府県の選択肢をつくる
        for (const [key , value] of Object.entries( data.offices )) {
            const option = document.createElement("option");

            option.textContent  = value.name;
            option.value        = key

            prefectureSelect.appendChild(option);
        }

    })
    .catch(error => {
        console.error("都道府県のデータ取得に失敗しました:", error);
    });

// 都道府県が変更された時に市町村を更新
prefectureSelect.addEventListener("change", (event) => {

    console.log( event.currentTarget.value );
    const prefectureCode = event.currentTarget.value;

    // 未指定を選んだ場合はここで終わる。アーリーリターン : 後続の処理ができない場合、ここで処理を終わる。
    if (!prefectureCode){ return false; }

    fetch(`https://www.jma.go.jp/bosai/common/const/area.json`)
        .then(response => response.json())
        .then(data => {

            // 都道府県コードをもとに紐づく市町村のコードの配列を取得。
            const children      = data.offices[prefectureCode].children;

            citySelect.innerHTML = '<option value="">詳細エリアを選択</option>';

            for (const child of children){

                // 市町村データは、 class10s ~ 20s に入っている。
                // この中から当てはまる市町村のデータを取得、選択肢をつくる。


                // 市町村コードの頭文字2文字を取得。2文字に応じて 10s 15s 20s に分ける。
                console.log(child);

                // class10s 15s 20s で市町村コードを探す。
                // 短絡評価
                // 式A || 式B || 式C || ....  式A、B、Cと順に実行していき、Aで値が取れた場合はそれを返す、ない場合はBへ
                const city = data.class10s[child] || data.class15s[child] || data.class20s[child] || [];


                // 市町村のデータ取得に失敗した場合はここで終わる。
                if (city === []){ continue; }

                citySelect.disabled = false;

                // 名前と市町村コードで、選択肢をつくる。
                console.log(city.name)

                const option = document.createElement("option");
                option.textContent  = city.name;
                option.value        = child;

                citySelect.appendChild(option);
            }
        })
        .catch(error => {
            console.error("市町村のデータ取得に失敗しました:", error);
        });
});

// 市町村が変更された時に天気情報を取得
citySelect.addEventListener("change", (event) => {
    const cityCode          = event.currentTarget.value;
    const prefectureCode    = prefectureSelect.value;

    if (!cityCode) { return false }

    // ここで選ばれた市町村の天気情報を取得する（仮のAPI URLを使用）
    fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${prefectureCode}.json`)
        .then(response => response.json())
        .then(data => {
            const weather = data[0].timeSeries[0].areas.find(area => area.area.code === cityCode);
            console.log(`選択された地域 (${cityCode}) の天気:`, weather);

            
        
            // 指定した日付と天気情報が一致しているか。
            const dateValue = document.querySelector("#date").value;

            // 2024-12-01 を タイムスタンプ(Dateで読めるフォーマット)に変換して、 Dateオブジェクトにする。時刻は0で初期化。
            const timestamp = Date.parse(dateValue);
            const date      = new Date(timestamp);
            date.setHours(0,0,0,0);

            const today     = new Date();
            today.setHours(0,0,0,0);

            const tomorrow  = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            // 明後日の日付をつくる。
            const dayAfterTomorrow = new Date(today);
            dayAfterTomorrow.setDate(today.getDate() + 2);


            // 今日と一致しているか、明日と一致しているか。
            // 三項演算子  条件式 ? 条件式に一致するときの値 : 一致しないときの値
            const is_today              = date.getTime() === today.getTime() ? true : false
            const is_tomorrow           = date.getTime() === tomorrow.getTime() ? true : false
            const is_dayAfterTomorrow   = date.getTime() === dayAfterTomorrow.getTime() ? true : false

            console.log(is_today);
            console.log(is_tomorrow);

            // 一致している方の天気を取得。どちらも一致していない場合は？記録しない？

            const weatherElement = document.querySelector("#weather");

            if (is_today){
                console.log( weather.weathers[0] );
                weatherElement.textContent = weather.weathers[0];
            }
            else if (is_tomorrow){
                console.log( weather.weathers[1] );
                weatherElement.textContent = weather.weathers[1];
            }
            else if (is_dayAfterTomorrow){
                console.log( weather.weathers[2] );
                weatherElement.textContent = weather.weathers[2];
            }
            else {
                console.log( "データなし" );
                weatherElement.textContent = "";
            }           
            

        })  
        .catch(error => {
            console.error("天気情報の取得に失敗しました:", error);
        });

});

//保存時に「保存されました」を表示
const save_btn = document.querySelector("#form_save");
const message_div = document.querySelector("#message");

save_btn.addEventListener('click', () => {
    message_div.classList.remove("hide");
    message_div.classList.add("text-success");
    message_div.textContent = '保存されました';

    setTimeout( () => {
        message_div.classList.add("hide");
        message_div.classList.remove("text-success");
    } , 3000 )

});


const delete_btn = document.querySelector("#data_delete");

delete_btn.addEventListener('click', () => {

    if(confirm('本当に保存したデータを削除しますか？')){
        // ローカルストレージのデータを削除する。
        localStorage.clear();

        message_div.classList.remove("hide");
        message_div.classList.add("text-danger");
        message_div.textContent = 'これまでのデータを削除しました。';
    
        setTimeout( () => {
            message_div.classList.add("hide");
            message_div.classList.remove("text-danger");
        } , 3000 )
    }
 
});

