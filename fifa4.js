var startModal;
var accessId;
startModal = new bootstrap.Modal(document.getElementById("startModal"), {
    backdrop: false,
    keyboard: false,
});

$("#toggler").click(function () {
    $("#intro").toggleClass("navzero");
});
function getFormatDate(date) {
    var year = date.getFullYear(); //yyyy
    var month = 1 + date.getMonth(); //M
    month = month >= 10 ? month : "0" + month; //month 두자리로 저장
    var day = date.getDate(); //d
    day = day >= 10 ? day : "0" + day; //day 두자리로 저장
    return year + "" + month + "" + day; //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}
function getDataAjax(url, nickname, id) {
    return $.ajax({
        type: "GET",
        url: `${url}${nickname}`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "String");
            xhr.setRequestHeader(
                "Authorization",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTkxMzA4NTA3NyIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU4MTY2MDc2MiwiZXhwIjoxNjQ0NzMyNzYyLCJpYXQiOjE1ODE2NjA3NjJ9.IxFpLK1aw0axXRvAgzEPv8AbhGFdMtXzfGp9IqMkATs"
            );
        },
        // dataType: "json",
    });
}
function findId(el, spid) {
    if (el.id === spid) {
        return true;
    }
}
function getDataAjax2() {
    return;
}
// function playerInfo(spid) {
//     var player;
//     $.ajax({
//         type: "GET",
//         async: false,
//         url: `./player.json`,

//         success: function (res) {
//             player = res.find((element, index, arr) => element.id === spid);
//             player = player.name;
//         },
//     });
//     return player;
// }
const ranker = [
    {
        divisionId: 800,
        divisionName: "슈퍼챔피언스",
    },
    {
        divisionId: 900,
        divisionName: "챔피언스",
    },
    {
        divisionId: 1000,
        divisionName: "슈퍼챌린지",
    },
    {
        divisionId: 1100,
        divisionName: "챌린지1",
    },
    {
        divisionId: 1200,
        divisionName: "챌린지2",
    },
    {
        divisionId: 1300,
        divisionName: "챌린지3",
    },
    {
        divisionId: 2000,
        divisionName: "월드클래스1",
    },
    {
        divisionId: 2100,
        divisionName: "월드클래스2",
    },
    {
        divisionId: 2200,
        divisionName: "월드클래스3",
    },
    {
        divisionId: 2300,
        divisionName: "프로1",
    },
    {
        divisionId: 2400,
        divisionName: "프로2",
    },
    {
        divisionId: 2500,
        divisionName: "프로3",
    },
    {
        divisionId: 2600,
        divisionName: "세미프로1",
    },
    {
        divisionId: 2700,
        divisionName: "세미프로2",
    },
    {
        divisionId: 2800,
        divisionName: "세미프로3",
    },
    {
        divisionId: 2900,
        divisionName: "유망주1",
    },
    {
        divisionId: 3000,
        divisionName: "유망주2",
    },
    {
        divisionId: 3100,
        divisionName: "유망주3",
    },
];
function getPlayerName() {
    return $.ajax({
        type: "GET",
        url: `./player.json`,
    });
}
function renderTable(res) {
    return new Promise(function (resolve, reject) {
        $("#transferTable").DataTable({
            responsive: true,
            select: true, ///항목 선택기능 추가
            scrollCollapse: true,
            processing: true,
            autoWidth: true,
            scrollX: true,
            scrollY: "450px",
            destroy: true,
            order: [[0, "desc"]],
            // pagingType: "simple",
            dom: 'rt<"float-left"p>',
            data: res,

            columns: [
                {
                    data: "tradeDate",
                    render: function (data) {
                        return data.substr(0, 10);
                    },
                },
                {
                    data: "spid",
                    // render: function (data, type, row, meta) {
                    //     var names = playerInfo(data);
                    //     return names;
                    // },
                },
                {
                    data: "grade",
                    render: function (data) {
                        return data + "카";
                    },
                },
                {
                    data: "value",
                    render: function (data) {
                        return data.toLocaleString("ko-KR");
                    },
                },
            ],
        });
        resolve("Finish");
    });
}
$("#testBtn").on("click", function () {
    startModal.hide();
    let nick = $("#testInput").val();
    console.log(nick);
    getDataAjax("https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=", nick, "123")
        .done((res) => {
            $("#myLevel").text(res.nickname);
            $("#getMyInfo").text(`LV : ${res.level}`);
            accessId = res.accessId;
            console.log(accessId);
            $("#transferTable > tbody").append(
                "<tr><td></td><td colspan='2'><i class='fa fa-spinner fa-spin fa-3x fa-fw'></i><span class='sr-only'>Loading...</span><td></tr>"
            );
        })
        .done(() => {
            getDataAjax("https://api.nexon.co.kr/fifaonline4/v1.0/users/", `${accessId}/maxdivision`, "123").done((res) => {
                let normalMatch = res[0];
                let teer = ranker.find((element) => element.divisionId == normalMatch.division);
                $("#getMyteer").text(`${teer.divisionName} /${normalMatch.achievementDate.substr(0, 10)}(달성일)`);
                console.log(typeof normalMatch.achievementDate);
                $("#getMyteerDate").text();
            });
        })
        .done(() => {
            getDataAjax(`https://api.nexon.co.kr/fifaonline4/v1.0/users/${accessId}/markets?tradetype=sell`, `&limit=100`, "123").done((res) => {
                var tableData = res; ///tabledata는 spid가 있는 그리드 데이터
                getPlayerName().done((res) => {
                    //res는 선수 id,name만 있음
                    for (i = 0; i < tableData.length; i++) {
                        var names = res.find((element) => element.id == tableData[i].spid);
                        tableData[i].spid = names.name;
                    }
                    renderTable(tableData).then((res) => {
                        $("table>thead").addClass("bg-dark text-white");
                        $("#transferTable_paginate").addClass("mt-3");
                        $(".pagination").addClass("pagination-sm");
                    });
                });
            });
        });
});
$(document).ready(function () {
    startModal.show();
});
