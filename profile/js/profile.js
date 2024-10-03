// all global variable declaration
let user;
let userInfo;
let allBookingData = [];
let allInHData = [];
let allArchData = [];
let allCashData = [];
let allCashArchData = [];
let navBrand = document.querySelector(".navbar-brand");
let logoutBtn = document.querySelector(".logout-btn");
let bookingForm = document.querySelector(".booking-form");
let allBInput = bookingForm.querySelectorAll("input");
let bTextarea = bookingForm.querySelector("textarea");
let inHouseForm = document.querySelector(".inhouse-form");
let allInHInput = inHouseForm.querySelectorAll("input");
let InHTextarea = inHouseForm.querySelector("textarea");
let modalCBtn = document.querySelectorAll(".btn-close");
let bListTBody = document.querySelector(".booking-list");
let inHListTBody = document.querySelector(".inhouse-list");
let archListTBody = document.querySelector(".archive-list");
let bRegBtn = document.querySelector(".b-register-btn");
let inHRegBtn = document.querySelector(".in-house-reg-btn");
let allTabBtn = document.querySelectorAll(".tab-btn");
let searchEl = document.querySelector(".search-input");
let cashierBtn = document.querySelector(".cashier-tab");
let cashierTab = document.querySelector("#cashier");
let bookingTab = document.querySelector("#booking");
let cashierForm = document.querySelector(".cashier-form");
let allCInput = cashierForm.querySelectorAll("input");
let cashBtn = document.querySelector(".cash-btn");
let cashierTbody = document.querySelector(".cashier-list");
let cashTotal = document.querySelector(".total");
let closeCashierBtn = document.querySelector(".close-cashier-btn");
let cashierArchTbody = document.querySelector(".cashier-arch-list");
let archTotal = document.querySelector(".arch-total");
let allPrintBtn = document.querySelectorAll(".print-btn");
let archPrintBtn = document.querySelector(".arch-print-btn");
let cashierTabPan = document.querySelector(".cashier-tab-pan");
let allTotalBtn = document.querySelectorAll(".total-btn");
let showBRoomsEl = document.querySelector(".show-booking-rooms");
let showHRoomsEl = document.querySelector(".show-inhouse-rooms");

// check user is login or not
if (sessionStorage.getItem("__au__") == null) {
    window.location = "../index.html";
}
userInfo = JSON.parse(sessionStorage.getItem("__au__"));
navBrand.innerHTML = userInfo.hotelName;
user = userInfo.email.split("@")[0];

// print coding
for(let btn of allPrintBtn){
    btn.onclick = () =>{
        window.print();
    }
}

archPrintBtn.onclick = () =>{
    cashierTabPan.classList.add('d-none');
    window.print();
}
modalCBtn[3].onclick = () =>{
    cashierTabPan.classList.remove('d-none');
}

// getting data from storage
const fetchData = (key) => {
    if (localStorage.getItem(key) != null) {
        const data = JSON.parse(localStorage.getItem(key));
        return data;
    }
    else {
        return [];
    }
}

allBookingData = fetchData(user + "_allBookingData");
allInHData = fetchData(user + "_allInHData");
allArchData = fetchData(user + "_allArchData");
allCashData = fetchData(user + "_allCashData");
allCashArchData = fetchData(user + "_allCashArchData");

// check hotels room

const checkRooms = (elements) =>{
    if(Number(userInfo.totalRoom) < Number(elements.value)){
        console.log("Hello");
        swal("Warning",`Total ${userInfo.totalRoom} rooms is available in the hotel`,'warning');
        elements.value = userInfo.totalRoom;
    }
}

allBInput[2].oninput = (e) =>{
    checkRooms(e.target);
}

allInHInput[2].oninput = (e) =>{
    checkRooms(e.target);
}

allCInput[1].oninput = (e) =>{
    checkRooms(e.target);
}

// format date function
const formatDate = (data, isTime) => {
    const date = new Date(data);
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let time = date.toLocaleTimeString();
    dd = dd < 10 ? "0" + dd : dd;
    mm = mm < 10 ? "0" + mm : mm;
    return `${dd}-${mm}-${yy} ${isTime ? time : ''}`;
}

// show total coding
const showTotal = () =>{
    allTotalBtn[0].innerText = "Total Booking = "+allBookingData.length;
    allTotalBtn[1].innerText = "Total InHouse = "+allInHData.length;
    allTotalBtn[2].innerText = "Total Archive = "+allArchData.length;
}
showTotal();

// Logout coding
logoutBtn.onclick = () => {
    logoutBtn.innerHTML = "Please wait...";
    setTimeout(() => {
        logoutBtn.innerHTML = "Logout";
        sessionStorage.removeItem("__au__");
        window.location = "../index.html";
    }, 3000)
}

// show data
const ShowData = (element, array, key) => {
    let tmp = key.split("_")[1];
    element.innerHTML = '';
    array.forEach((item, index) => {
        element.innerHTML += `
           <tr class="text-nowrap">
                <td class="no-print">${index + 1}</td>
                <td>${item.location}</td>
                <td>${item.roomNo}</td>
                <td>${item.fullname}</td>
                <td>${formatDate(item.checkInDate)}</td>
                <td>${formatDate(item.checkOutDate)}</td>
                <td>${item.totalPeople}</td>
                <td>${item.mobile}</td>
                <td>${item.price}</td>
                <td>${item.notice}</td>
                <td class="no-print">${formatDate(item.createdAt, true)}</td>
                <td class="text-nowrap no-print">
                    <button class="${tmp == 'allArchData' && 'd-none'} btn edit-btn p-1 px-2 btn-primary"><i class="fa fa-edit"></i></button>
                    <button class="btn checkin-btn p-1 px-2 btn-info text-white"><i
                            class="fa fa-check"></i></button>
                    <button class="btn del-btn p-1 px-2 btn-danger"><i class="fa fa-trash"></i></button>
                </td>
            </tr>
        `
    })
    deleteDataFunc(element, array, key);
    updateDataFunc(element, array, key);
    checkInAndCheckout(element, array, key);
}

// delete coding
function deleteDataFunc(element, array, key) {
    let allDelBtn = element.querySelectorAll(".del-btn");
    allDelBtn.forEach((btn, index) => {
        btn.onclick = () => {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this imaginary file!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        array.splice(index, 1);
                        localStorage.setItem(key, JSON.stringify(array));
                        ShowData(element, array, key);
                        swal("Poof! Your imaginary file has been deleted!", {
                            icon: "success",
                        });
                    } else {
                        swal("Your imaginary file is safe!");
                    }
                });
        }
    });
}

// Update coding
const updateDataFunc = (element, array, key) => {
    let allEditBtn = element.querySelectorAll(".edit-btn");
    allEditBtn.forEach((btn, index) => {
        btn.onclick = () => {
            let tmp = key.split("_")[1];
            tmp == "allBookingData" ? bRegBtn.click() : inHRegBtn.click();
            let allBtn = tmp == "allBookingData"
                ? bookingForm.querySelectorAll("button")
                : inHouseForm.querySelectorAll("button");

            let allInput = tmp == "allBookingData"
                ? bookingForm.querySelectorAll("input")
                : inHouseForm.querySelectorAll("input");

            let textarea = tmp == "allBookingData"
                ? bookingForm.querySelector("textarea")
                : inHouseForm.querySelector("textarea");

            allBtn[0].classList.add("d-none");
            allBtn[1].classList.remove("d-none");
            let obj = array[index];
            allInput[0].value = obj.fullname;
            allInput[1].value = obj.location;
            allInput[2].value = obj.roomNo;
            allInput[3].value = obj.totalPeople;
            allInput[4].value = obj.checkInDate;
            allInput[5].value = obj.checkOutDate;
            allInput[6].value = obj.price;
            allInput[7].value = obj.mobile;
            textarea.value = obj.notice;
            allBtn[1].onclick = () => {
                let formData = {
                    notice: textarea.value,
                    createdAt: new Date()
                }
                for (let el of allInput) {
                    let key = el.name;
                    let value = el.value;
                    formData[key] = value;
                }
                array[index] = formData;
                allBtn[0].classList.remove("d-none");
                allBtn[1].classList.add("d-none");

                tmp == "allBookingData"
                    ? bookingForm.reset('')
                    : inHouseForm.reset('');

                tmp == "allBookingData"
                    ? modalCBtn[0].click()
                    : modalCBtn[1].click();

                localStorage.setItem(key, JSON.stringify(array));
                ShowData(element, array, key);
            }
        }
    })
}

// checkin and checkout coding
const checkInAndCheckout = (element, array, key) => {
    let allCheckBtn = element.querySelectorAll(".checkin-btn");
    allCheckBtn.forEach((btn, index) => {
        btn.onclick = () => {
            let tmp = key.split("_")[1];
            let data = array[index];
            array.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(array));
            if (tmp == "allBookingData") {
                allInHData.unshift(data);
                localStorage.setItem(user + "_allInHData", JSON.stringify(allInHData))
                ShowData(element, array, key);
                showBookingRooms();
                showInhouseRooms();
            }
            else if(tmp == "allArchData"){
                allBookingData.unshift(data);
                localStorage.setItem(user + "_allBookingData", JSON.stringify(allBookingData));
                ShowData(element, array, key);
                showBookingRooms();
                showInhouseRooms();
            }
            else {
                allArchData.unshift(data);
                localStorage.setItem(user + "_allArchData", JSON.stringify(allArchData));
                ShowData(element, array, key);
                showBookingRooms();
                showInhouseRooms();
            }
        }
    });
}

// registration coding
const registrationFunc = (textarea=null, inputs, array, key) => {
    let data = {
        notice: textarea && textarea.value,
        inHouse : false,
        createdAt: new Date()
    };
    for (let el of inputs) {
        let key = el.name;
        let value = el.value;
        data[key] = value;
    }
    // console.log(data);
    array.unshift(data);
    localStorage.setItem(key, JSON.stringify(array));
    swal("Good Job !", "Booking Success", 'success');
}

// show booking rooms
const showBookingRooms = () =>{
     showBRoomsEl.innerHTML = '';
     allBookingData.forEach((item,index)=>{
        console.log(item,index);
        showBRoomsEl.innerHTML += `
        <div class="card px-0 text-center col-md-2">
            <div class="bg-danger text-white fw-bold card-header">
                ${item.roomNo}
            </div>
            <div class="bg-success text-white fw-bold card-body">
                <p>${formatDate(item.checkInDate)}</p>
                <p>To</p>
                <p>${formatDate(item.checkOutDate)}</p>
            </div>
        </div>
        `
     })
}
showBookingRooms();

// show inhouse rooms
const showInhouseRooms = () =>{
    showHRoomsEl.innerHTML = '';
    allInHData.forEach((item,index)=>{
       console.log(item,index);
       showHRoomsEl.innerHTML += `
       <div class="card px-0 text-center col-md-2">
           <div class="bg-danger text-white fw-bold card-header">
               ${item.roomNo}
           </div>
           <div class="card-body">
                <img src="${item.inHouse ? '../img/dummy.png' : '../img/lock.png'}" class="w-100" alt="">
            </div>
            <div class="card-footer">
                <button class="in-btn action-btn btn text-white">
                    In
                </button>
                <button class="out-btn action-btn btn text-white">
                    Out
                </button>
            </div>
       </div>
       `
    });

    // in coding
    let allInBtn = showHRoomsEl.querySelectorAll(".in-btn");
    allInBtn.forEach((btn,index)=>{
        btn.onclick = () =>{
            let data = allInHData[index];
            data.inHouse = true;
            allInHData[index] = data;
            localStorage.setItem(user+"_allInHData",JSON.stringify(allInHData));
            showInhouseRooms();
        }
    })
    // out coding
    let allOutBtn = showHRoomsEl.querySelectorAll(".out-btn");
    allOutBtn.forEach((btn,index)=>{
        btn.onclick = () =>{
            let data = allInHData[index];
            data.inHouse = false;
            allInHData[index] = data;
            localStorage.setItem(user+"_allInHData",JSON.stringify(allInHData));
            showInhouseRooms();
        }
    })
}
showInhouseRooms();

// Start booking store coding
bookingForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(bTextarea, allBInput, allBookingData, user + "_allBookingData");
    bookingForm.reset('');
    modalCBtn[0].click();
    ShowData(bListTBody, allBookingData, user + "_allBookingData");
    showTotal();
    showBookingRooms();
}

// Start inhouse booking coding
inHouseForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(InHTextarea, allInHInput, allInHData, user + "_allInHData");
    inHouseForm.reset('');
    modalCBtn[1].click();
    ShowData(inHListTBody, allInHData, user + "_allInHData");
    showTotal();
    showInhouseRooms();
}

// Start cashier store coding
cashierForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(null,allCInput, allCashData, user + "_allCashData");
    cashierForm.reset('');
    modalCBtn[2].click();
    showCashierFunc();
}

// search function
const searchFunc = () =>{
    let value = searchEl.value.toLowerCase();
    let tableEl = document.querySelector(".tab-content .search-pane.active");
    let tr = tableEl.querySelectorAll("tbody tr");
    for(let el of tr){
        let srNo = el.querySelectorAll("TD")[0].innerText;
        let location = el.querySelectorAll("TD")[1].innerText;
        let roomNo = el.querySelectorAll("TD")[2].innerText;
        let fullname = el.querySelectorAll("TD")[3].innerText;
        let mobile = el.querySelectorAll("TD")[7].innerText;
        let price = el.querySelectorAll("TD")[8].innerText;
        if(srNo.indexOf(value) != -1){
             el.classList.remove('d-none');
        }
        else if(location.toLowerCase().indexOf(value) != -1){
            el.classList.remove('d-none');
        }
        else if(roomNo.toLowerCase().indexOf(value) != -1){
            el.classList.remove('d-none');
        }
        else if(fullname.toLowerCase().indexOf(value) != -1){
            el.classList.remove('d-none');
        }
        else if(mobile.toLowerCase().indexOf(value) != -1){
            el.classList.remove('d-none');
        }
        else if(price.toLowerCase().indexOf(value) != -1){
            el.classList.remove('d-none');
        }
        else{
            el.classList.add('d-none');
        }
    }
}

// search coding
searchEl.oninput = () =>{
    searchFunc();
}

// refresh ui data coding
for (let btn of allTabBtn) {
    btn.onclick = () => {
        ShowData(bListTBody, allBookingData, user + "_allBookingData");
        ShowData(inHListTBody, allInHData, user + "_allInHData");
        ShowData(archListTBody, allArchData, user + "_allArchData");
    }
}

ShowData(bListTBody, allBookingData, user + "_allBookingData");
ShowData(inHListTBody, allInHData, user + "_allInHData");
ShowData(archListTBody, allArchData, user + "_allArchData");

// cashier coding

const showCashierFunc = () =>{
    let totalAmount = 0;
    cashierTbody.innerHTML = '';
    allCashData.forEach((item,index)=>{
        totalAmount += +item.amount;
        // totalAmount += Number(item.amount);
        cashierTbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${item.roomNo}</td>
            <td>${item.cashierName}</td>
            <td>${formatDate(item.createdAt,true)}</td>
            <td>${item.amount}</td>
        </tr>
        `
    });
    cashTotal.innerHTML = "<i class='fa fa-rupee'></i> "+totalAmount;
}
showCashierFunc();

// all archive cash coding

const showCashArchFunc = () =>{
    let totalAmount = 0;
    cashierArchTbody.innerHTML = '';
    allCashArchData.forEach((item,index)=>{
        totalAmount += +item.total;
        // totalAmount += Number(item.amount);
        cashierArchTbody.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${item.cashierName}</td>
            <td>${formatDate(item.createdAt,true)}</td>
            <td>${item.total}</td>
        </tr>
        `
    });
    archTotal.innerHTML = "<i class='fa fa-rupee'></i> "+totalAmount;
}
showCashArchFunc();

cashBtn.onclick = () =>{
    allCInput[2].value = sessionStorage.getItem("c_name");
}

cashierBtn.onclick = () =>{
    if(sessionStorage.getItem("c_name") == null){
        let name = window.prompt("Enter your name !");
        if(name){
            sessionStorage.setItem("c_name",name);
        }
        else{
            allTabBtn[0].classList.add("active");
            bookingTab.classList.add("active");
            cashierBtn.classList.remove("active");
            cashierTab.classList.remove("active");
        }
    }
    else{
        allCInput[2].value = sessionStorage.getItem("c_name");
    }
}

// close cashier coding
closeCashierBtn.onclick = () =>{
    if(allCashData.length > 0){
        let data = {
            cashierName : sessionStorage.getItem("c_name"),
            total : cashTotal.innerText,
            createdAt : new Date()
        }
        allCashArchData.push(data);
        allCashData = [];
        localStorage.removeItem(user+"_allCashData");
        localStorage.setItem(user+"_allCashArchData",JSON.stringify(allCashArchData));
        sessionStorage.removeItem("c_name");
        showCashierFunc();
    }
    else{
        swal('Warning',"There is no cash to close",'warning');
    }
}