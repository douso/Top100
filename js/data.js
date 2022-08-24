let page = 1;
const per_page = 100;

$(function() {
    const kd = $('.category .active').attr('data-search');
    showLoading();
    getData(kd);

    // 切换分类
    $('.category span').click(function() {
        const kd = $(this).attr('data-search');
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $('.bottom-box h4 a').html('');
        $('.main ul').html('');
        $('.bottom-box .desc').text('');
        $('.bottom-box .pic img').attr('src', 'img/gezi.svg');
        page = 1;
        showLoading();
        getData(kd);
    });
    $(document).on('click', '.more span', function() {
        const kd = $('.category .active').attr('data-search');
        showLoading();
        getData(kd, 'pagemore');
    })
})

function showLoading() {
    $('.more span').hide();
    $('.more img').show();
}

function hideLoading() {
    $('.more img').hide();
    $('.more span').show();
}

function getData(keyword, type='init') {
    $.ajax({
        type: "GET",
        url: `https://api.github.com/search/repositories?q=${keyword}+stars:>=1000&sort=stars&order=desc&per_page=${per_page}&page=${page}`,
        success: function(data) {
            hideLoading();
            if (!data.items[99]) {
                $('.more').hide();
            }
            type == 'init' ? render(data.items) : pageRender(data.items);
        }
    })
}

function formatStar(num) {
    return num >= 1000 ? (num/1000).toLocaleString('zh-CN', {maximumFractionDigits: 1}) + 'k' : num;
}

function renderHtml(data, startIndex) {
    const len = data.length;
    let html = '';
    for (const item of data) {
        const description = filterHtmlTag(item.description);
        let classStr = '';
        let hrefStr = 'javascript:;';
        let target = '';
        if (item.homepage) {
            classStr = 'class="active"';
            hrefStr = item.homepage;
            target = `target="_blank"`;
        }
        html += `
        <li ${classStr}>
            <span>${startIndex}</span>
            <div class="pic"><img src="${item.owner.avatar_url}" alt=""></div>
            <div class="content">
                <h4><a href="${hrefStr}" ${target}>${item.name}</a> <span class="star"><img src="img/star.svg"/>${formatStar(item.stargazers_count)}</span></h4>
                <p>${description}</p>
            </div>
            <a href="${item.html_url}" target="_blank" class="github"><img src="img/github.svg" git/></a>
        </li>
        `
        startIndex++;
    }
    return html;
}

function render(data) {
    page++;
    const firstItem = data.shift();
    $('.bottom-box h4 a').html(`${firstItem.name}<span class="star"><img src="img/star.svg"/>${formatStar(firstItem.stargazers_count)}</span>`);
    $('.bottom-box h4 a').attr('href', firstItem.homepage);
    $('.bottom-box .pic img').attr('src', firstItem.owner.avatar_url);
    const description = filterHtmlTag(firstItem.description);
    $('.bottom-box .desc').text(description);
    const html = renderHtml(data, 2);
    $('.main ul').html(html);
}

function pageRender(data) {
    const html = renderHtml(data, (page-1)*per_page+1);
    $('.main ul').append(html);
    page++; 
}

function filterHtmlTag(str) {
    return str ? str.replace(/<.*?>/g,"") : '';
}