// some scripts
"use strict";

// BLOCK HEIGHT
function block_height(argument) {
  var mh = 0;
  $(argument).each(function () {
    if ($(this).height() > mh) {
      mh = $(this).height();
    }
  });
  $(argument).height(mh);
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = function(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
// animateValue($('tag')[0], 150, 200, 5000);



function forFixedScroll(obj){
  var a = obj.parent().offset().top - $(window).height(),
      b = obj.parent().offset().top + obj.height(),
      c = $(document).scrollTop();
  if (a < c && b > c) {
    $(obj).addClass('active');
  }
}
        // if ($(window).width() > 1200) {
        //   forFixedScroll($('.progress-circle'));
        // }

function slider_count(all, all_obj, current_obj, slider){
  all = ( (all.length > 1) ? all : ( '0' + all.toString() ) );
  all_obj.html(all);
  slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
  setTimeout(function(){
    var i = $(slick.$dots).find('.slick-active button').html();
    i = ( (i.length > 1) ? i : ( '0' + i.toString() ) );
    current_obj.html(i);
  },200)
});
}



$(document).ready(function(){

  // LOADER
  // var global_loader = setInterval (function(){
  //       if( $('#intro .intro_slider .item img').ready()[0].complete ){
  //         $(".preloader").fadeOut("slow");
  //          clearInterval(global_loader);
  //       }
  //     },100);

  //////////////////////// Menu scroll to section for landing
  $('a.page-scroll').click(function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({ scrollTop: $($anchor.attr('href')).offset().top - 50  }, 1000);
      event.preventDefault();
  });


  $(document).on('click', '#header .top_block .burger, #header ul li a.page-scroll', function(){
    $(this).toggleClass('active')  
    $('#header .menu').slideToggle(300) 
  });
  


  if ($('#intro .intro_slider').length) {
    $('#intro .intro_slider').slick({
      dots: true,
      infinite: false,
      speed: 500,
      fade: true,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: false,
      cssEase: 'linear',
      prevArrow: $('#intro .arrows span.prev'),
      nextArrow: $('#intro .arrows span.next'),
    })
    slider_count($('#intro .intro_slider .slick-dots li:last-child button').html(), $('#intro .slider_count span.all font'), $('#intro .slider_count span.active'), $('#intro .intro_slider'));
  }
  


  if ($('.text_slider .slider').length > 1) {
    $('.text_slider .slider').each(function(){
      var $t = $(this);
      $t.slick({
        dots: true,
        infinite: false,
        speed: 500,
        prevArrow: $t.parents('.text_slider').find('span.prev'),
        nextArrow: $t.parents('.text_slider').find('span.next'),
      });
      slider_count($t.find('.slick-dots li:last-child button').html(), $t.parents('.text_slider').find('.bottom .slider_count span.all font'), $t.parents('.text_slider').find('.bottom .slider_count span.active'), $t);
    });
  }
  


  if ($('#gallery .slider').length) {
    $('#gallery .slider').slick({
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true,
      dots: true,
      infinite: false,
      adaptiveHeight: true,
      prevArrow: $('#gallery .arrows span.prev'),
      nextArrow: $('#gallery .arrows span.next'),
    });
    $('#gallery .slider .slick-dots li:nth-child(2) button')[0].click();
    slider_count($('#gallery .slider .slick-dots li:last-child button').html(), $('#gallery .slider_count span.all font'), $('#gallery .slider_count span.active'), $('#gallery .slider'));

    // $('#section_three .bottom .slider_count')
  }



  $(document).on('click', '#choose_apartment .top .buttons .rooms .btns a', function(e){
    e.preventDefault();
    $(this).addClass('active').siblings('a').removeClass('active');
    var plan_btns = $('#choose_apartment .top .buttons .type .type_btn'+$(this).attr('href'));
    plan_btns.addClass('active').siblings('div').removeClass('active');
    plan_btns.children('.btns').children('a:first-child')[0].click();
  });

  $(document).on('click', '#choose_apartment .top .buttons .type .btns a', function(e){
    e.preventDefault();
    $('#choose_apartment .content').addClass('img_loading');
    $(this).addClass('active').siblings('a').removeClass('active');
    var room = $('#choose_apartment .top .buttons .rooms .btns a.active').attr('href'),
        type = $(this).attr('href'),
        area = $('.area_text_info .area_'+room.toString()+type).html(),
        link = 'img/apartments/',
        scheme = link+room+'/'+type+'.png',
        virtual = link+room+'/'+type+'-0.png',
        apartment_position = link+room+'/'+type+'-00.png';


    $('#scheme').attr('src', scheme).attr('data-src', scheme);
    $('#virtual').attr('src', virtual).attr('data-src', virtual);
    $('#choose_apartment .content .container .apartment_info img').attr('src', apartment_position);

    $('#choose_apartment .content .container .apartment_info .section_title span').html( (room < 2) ? room : (room + '-Х') );
    $('#choose_apartment .content .container .apartment_info h3 span').html(area);

    var loader = setInterval (function(){
          if(
              $('#scheme').ready()[0].complete &&
              $('#virtual').ready()[0].complete &&
              $('#choose_apartment .content .container .apartment_info img').ready()[0].complete
            ){
             $('#choose_apartment .content').removeClass('img_loading');
             clearInterval(loader);
          }
        },200);


  });

  $(document).on('click', '#choose_apartment .content .container .img_view a', function(e){
    e.preventDefault();
    $(this).addClass('active').siblings('a').removeClass('active');
    $($(this).attr('href')).addClass('active').siblings('img').removeClass('active');
  })



  function map_init(){
    $('#map').css('height', 'calc( '+$('#contacts .info').height()+'px + ' + (($(window).width() > 768) ? '26.64rem' :  '0rem'));
    mapboxgl.accessToken = 'pk.eyJ1IjoibHV4dXJ5aG91c2UiLCJhIjoiY2tpMHJicWNzMHNlbjJycWhlb2huamI3ciJ9.BOZFhW-w2IXpngqSZ34zYw';
    var geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'properties': {
                    // 'message': 'OpenEngine',
                    'iconSize': [100, 100]
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [69.358278, 41.347252],
                }
            }
        ]
    };
    var l  = ($(window).width() > 768) ? 69.388278 : 69.358278;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [l, 41.347252],
        zoom: 13,
        // scrollZoom: {
        //  ctrl: true
        // }
    });
    const  mapOptions  =  { 
      scrollZoom : { 
       ctrl : true 
      } 
    } ;
    map.scrollZoom.disable();
    console.log(map);

    // add markers to map
    geojson.features.forEach(function(marker) {
    // create a DOM element for the marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundSize = 'contain';
    el.style.backgroundImage = 'url(img/icons/map_white_location.svg)';
    el.style.width = marker.properties.iconSize[0] + 'px';
    el.style.height = marker.properties.iconSize[1] + 'px';
     
    // add marker to map
    new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    });
  }map_init();




  //open popup
    $('.popup-trigger').on('click', function(event){
      event.preventDefault();
      var anchor = $(this).attr('href');
      $('body').addClass('overflow-hidden');
      $(anchor+'.popup').addClass('is-visible');
    });
    //close popup
    $('.popup').on('click', function(event){
      if( $(event.target).is('.popup-close') || $(event.target).is('.popup') ) {
        event.preventDefault();
        $(this).removeClass('is-visible');
        $('body').removeClass('overflow-hidden');
      }
    });
    //close popup when clicking the esc keyboard button
    $(document).keyup(function(event){
        if(event.which=='27'){
          $('.popup').removeClass('is-visible');
        }
    });


  // INPUT
    $(document).on('change, keyup, focus, focusout', '.input_content input', function(){
      if ($(this).val().length) {
        $(this).parent('.input_content').addClass('focus');
      }else{
        $(this).parent('.input_content').removeClass('focus');
      }
    });
    $(document).on('click', '.input_content span', function(){
      $(this).prev('input').focus();
    });



$(document).on('click', '#choose_apartment .content .container .apartment_img img', function(){
  var data_src = $(this).attr('src');
  $.fancybox.open({
    src: data_src,
    opts: {}
  })
})



});
$(window).on('load', function(){

  // LOADER
  // $(".preloader").fadeOut("slow");


  var block_height_article = setInterval (function(){
        if(
            $('#characteristics .line .article .img img:last-child').ready()[0].complete
          ){
            block_height($('#characteristics .line .article'));
            clearInterval(block_height_article);
        }
      },200);
});










// CONTACT FORM
  $('.phone').keydown(function (e) {
      var key = e.charCode || e.keyCode || 0;
      var $phone = $(this);

      // Auto-format- do not expose the mask as the user begins to type
      if (key !== 8 && key !== 9) {
          if ($phone.val().length === 0 || $phone.val().length === 1 || $phone.val().length === 2 || $phone.val().length === 3) {
              $phone.val('');
              $phone.val($phone.val() + '+998');
          }
          if ($phone.val().length === 4) {
              $phone.val($phone.val() + ' (');
          }
          if ($phone.val().length === 8) {
              $phone.val($phone.val() + ') ');
          }
          if ($phone.val().length === 13) {
              $phone.val($phone.val() + '-');
          }
          if ($phone.val().length === 16) {
              $phone.val($phone.val() + '-');
          }
          if ($phone.val().length === 19) {
              return false
          }
      }

      // Allow numeric (and tab, backspace, delete) keys only
      return (key == 8 ||
      key == 9 ||
      key == 46 ||
      (key >= 48 && key <= 57) ||
      (key >= 96 && key <= 105));
  })
  .bind('focus click', function () {
      var $phone = $(this);

      if ($phone.val().length === 0) {
          $phone.val('+998');
      }
      else {
          var val = $phone.val();
          $phone.val('').val(val); // Ensure cursor remains at the end
      }
  });
// CONTACT FORM END








// TELEGRAM FORM
  function form(name, phone, img_url = false){
      img_url = img_url.length ? img_url : false;
      if(name.length > 3 && phone.length == 19){
          $.ajax({
              type: "POST",
              url: "../form.php",
              dataType: "json",
              data: { 
                'name': name, 
                'phone': phone,
                'img_url': img_url
              },
              success: function(data){
                console.log(data);
                $('.form').addClass('success').prev('.section_title').addClass('hide');
              }
          })
      }
  }
  var busy = false;
  $(document).on('click', '.form button', function(){
    var this_form = $(this).parents('.form'),
        name = this_form.find('input.name')[0].value,
        phone = this_form.find('input.phone')[0].value;
        // img_url = this_form.find('input.img_url')[0].value;

        if (!(name.length > 3)) {
          this_form.find('input.name').addClass('danger');
        }
        if (!(phone.length == 19)) {
          this_form.find('input.phone').addClass('danger');
        }

        setTimeout(function(){
          this_form.find('input').removeClass('danger');
          this_form.find('.placeholder').removeClass('danger');
        },1000)

      if (name.length > 3 && phone.length == 19 && !busy) {
        form(name, phone);
        busy = true;
      }
  });
// TELEGRAM FORM END











$(document).ready(function () {
    var preloader    = $('.preloader'), // селектор прелоадера
        imagesCount  = $('img').length, // количество изображений
        percent      = 100 / imagesCount, // количество % на одну картинку
        progress     = 0, // точка отсчета
        imgSum       = 5, // количество картинок
        loadedImg    = 0; // счетчик загрузки картинок

    if (imagesCount >= imgSum && imagesCount > 0) {

        for (var i = 0; i < imagesCount; i++) { // создаем клоны изображений
            var img_copy        = new Image();
            img_copy.src        = document.images[i].src;
            img_copy.onload     = img_load;
            img_copy.onerror    = img_load;
        }

        function img_load () {
            progress += percent;
            loadedImg++;
            if (progress >= 100 || loadedImg == imagesCount) {
                preloader.delay(400).fadeOut('slow');
            }
            $('.preloader .text .load').width(parseInt(progress)+'%')
        }
    } else {
        preloader.remove();
    }
});