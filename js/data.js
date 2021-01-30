$(function() {
    const kd = $('.category .active').attr('data-search');
    getData(kd);

    // 切换分类
    $('.category span').click(function() {
        const kd = $(this).attr('data-search');
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        getData(kd);
    });
})

function getData(keyword) {
    $('.bottom-box h4 a').text('');
    $('.main ul').html('');
    $('.bottom-box .desc').text('');
    $('.bottom-box .pic img').attr('src', 'img/loading.svg');
    $.ajax({
        type: "GET",
        url: `https://api.github.com/search/repositories?q=${keyword}+stars:>=10000&sort=stars&order=desc&per_page=100`,
        success: function(data) {
            render(data.items);
        }
    })
}

function render(data) {
    const firstItem = data.shift();
    $('.bottom-box h4 a').text(firstItem.name);
    $('.bottom-box h4 a').attr('href', firstItem.homepage);
    $('.bottom-box .pic img').attr('src', firstItem.owner.avatar_url);
    const description = filterHtmlTag(firstItem.description);
    $('.bottom-box .desc').text(description);
    const len = data.length;
    let html = '';
    for(let i=0; i<len; i++) {
        const description = filterHtmlTag(data[i].description);
        let classStr = '';
        let hrefStr = 'javascript:;';
        let target = '';
        if (data[i].homepage) {
            classStr = 'class="active"';
            hrefStr = data[i].homepage;
            target = `target="_blank"`;
        }
        html += `
        <li ${classStr}>
            <span>${i+2}</span>
            <div class="pic"><img src="${data[i].owner.avatar_url}" alt=""></div>
            <div class="content">
                <h4><a href="${hrefStr}" ${target}>${data[i].name}</a></h4>
                <p>${description}</p>
            </div>
            <a href="${data[i].html_url}" target="_blank" class="github"><img src="img/github.svg" git/></a>
        </li>
        `
    }
    $('.main ul').html(html);
}

function filterHtmlTag(str) {
    return str ? str.replace(/<.*?>/g,"") : '';
}