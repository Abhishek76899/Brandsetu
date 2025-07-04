/*
  [JS Index]
  
  ---
  
  Template Name: Drex - Photography Portfolio Template
  Author:  ex-nihilo
  Version: 1.0
*/


/*
  1. preloader
  2. show elements
    2.1. page loaded
    2.2. page ready
  3. slick slider
  4. to top arrow animation
    4.1. to top arrow scroll to top
  5. forms
    5.1. newsletter form
    5.2. contact form
  6. navigation page scroll
  7. modals
    7.1. sign up modal
      7.1.1. sign up modal additional CLOSER
  8. YouTube player
  9. swiper slider
    9.1. swiper thumbnail slider horizontal thumbs
  10. typed text
  11. navigation
    11.1. navigation active state
  12. owl slider
    12.1. owl news carousel slideshow
*/


$(function() {
    "use strict";
	
	
    $(window).on("load", function() {
        // 1. preloader
        $("#preloader").fadeOut(600);
        $(".preloader-bg").delay(400).fadeOut(600);
		
        // 2. show elements
        // 2.1. page loaded
        setTimeout(function() {
            $("body").addClass("page-loaded");
        }, 400);
        // 2.2. page ready
        $("body").addClass("page-ready");
		
        // 3. slick slider
        $(".slider").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            asNavFor: ".home-img-container",
            pauseOnHover: true,
            speed: 800,
            variableWidth: true,
            infinite: false,
            autoplay: true,
            autoplaySpeed: 8000,
        });
        $(".home-img-container").slick({
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: ".slider",
            dots: false,
            pauseOnHover: true,
            speed: 600,
            variableWidth: true,
            infinite: false,
            autoplay: true,
            autoplaySpeed: 8000,
        });
    });
	
    $(window).on("scroll", function() {
        // 4. to top arrow animation
        if ($(this).scrollTop() > 500) {
            $(".to-top-arrow").addClass("show");
        } else {
            $(".to-top-arrow").removeClass("show");
        }
    });
	
    // 4.1. to top arrow scroll to top
    $(".scrollToTop").on("click", function() {
        $("html, body").animate({
            scrollTop: 0
        }, 800);
        return false;
    });
	
    // 5. forms
    // 5.1. newsletter form
    $("form#subscribe").on("submit", function() {
        $("form#subscribe .subscribe-error").remove();
        $.post("subscribe.php");
        var s = !1;
        if ($(".subscribe-requiredField").each(function() {
                if ("" === jQuery.trim($(this).val())) $(this).prev("label").text(), $(this).parent().append('<span class="subscribe-error">Please enter your Email</span>'),
                    $(this).addClass("inputError"), s = !0;
                else if ($(this).hasClass("subscribe-email")) {
                    var r = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    r.test(jQuery.trim($(this).val())) || ($(this).prev("label").text(), $(this).parent().append('<span class="subscribe-error">Please enter a valid Email</span>'),
                        $(this).addClass("inputError"), s = !0);
                }
            }), !s) {
            $("form#subscribe input.submit").fadeOut("normal", function() {
                $(this).parent().append("");
            });
            var r = $(this).serialize();
            $.post($(this).attr("action"), r, function() {
                $("form#subscribe").slideUp("fast", function() {
                    $(this).before('<div class="subscribe-success">Thank you for subscribing.</div>');
                });
            });
        }
        return !1;
    });
    // 5.2. contact form
    $("form#form").on("submit", function() {
        $("form#form .error").remove();
        var s = !1;
        if ($(".requiredField").each(function() {
                if ("" === jQuery.trim($(this).val())) $(this).prev("label").text(), $(this).parent().append('<span class="error">This field is required</span>'), $(this).addClass(
                    "inputError"), s = !0;
                else if ($(this).hasClass("email")) {
                    var r = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    r.test(jQuery.trim($(this).val())) || ($(this).prev("label").text(), $(this).parent().append('<span class="error">Invalid email address</span>'), $(this).addClass(
                        "inputError"), s = !0);
                }
            }), !s) {
            $("form#form input.submit").fadeOut("normal", function() {
                $(this).parent().append("");
            });
            var r = $(this).serialize();
            $.post($(this).attr("action"), r, function() {
                $("form#form").slideUp("fast", function() {
                    $(this).before('<div class="success">Your email was sent successfully.</div>');
                });
            });
        }
        return !1;
    });
	
    // 6. navigation page scroll
    $(".page-scroll").on("click", function(e) {
        var $anchor = $(this);
        $("html, body").stop().animate({
            scrollTop: $($anchor.attr("href")).offset().top - 0
        }, 1500, 'easeInOutExpo');
        e.preventDefault();
    });
	
    // 7. modals
    // 7.1. sign up modal
    $(".sign-up-modal-launcher, .sign-up-modal-closer").on("click", function() {
        if ($(".sign-up-modal").hasClass("open")) {
            $(".sign-up-modal").removeClass("open");
        } else {
            $(".sign-up-modal").addClass("open");
        }
    });
    // 7.1.1. sign up modal additional CLOSER
    $(".hamburger").on("click", function() {
        $(".sign-up-modal").removeClass("open");
    });
	
    // 8. YouTube player
    $("#bgndVideo").YTPlayer();
	
    // 9. swiper slider
    // 9.1. swiper thumbnail slider horizontal thumbs
    var swipersliderTop = new Swiper(".swiper-slider-top", {
        direction: "horizontal",
        nextButton: ".swiper-button-next",
        prevButton: ".swiper-button-prev",
        autoplay: 4000,
        speed: 1600,
        spaceBetween: 0,
        centeredSlides: true,
        slidesPerView: "auto",
        touchRatio: 1,
        loop: true,
        slideToClickedSlide: true,
        mousewheelControl: false,
        keyboardControl: false
    });
    var swipersliderBottom = new Swiper(".swiper-slider-bottom", {
        direction: "horizontal",
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: "auto",
        touchRatio: 1,
        loop: true,
        slideToClickedSlide: true,
        mousewheelControl: false,
        keyboardControl: false
    });
    swipersliderTop.params.control = swipersliderBottom;
    swipersliderBottom.params.control = swipersliderTop;
	
    // 10. typed text
    $(".typed-title").typed({
		strings: ["Fully Responsive", "Photography Portfolio", "Made for KINGS"],
        typeSpeed: 35,
        backDelay: 4500,
        loop: true
    });
	
    // 11. navigation
    // 11.1. navigation active state
    $("a.menu-state").on("click", function() {
        $("a.menu-state").removeClass("active");
        $(this).addClass("active");
    });
// Show more/less functionality
document.querySelectorAll('.show-more-btn').forEach(button => {
    button.addEventListener('click', function() {
        const detail = this.closest('li').querySelector('.service-detail');
        detail.classList.toggle('visible');
        
        // Toggle button text
        if (detail.classList.contains('visible')) {
            this.textContent = 'Show Less -';
        } else {
            this.textContent = 'Show More +';
        }
    });
});
	// 12. owl slider
    // 12.1. owl news carousel slideshow
    $("#news-carousel").owlCarousel({
        loop: true,
        center: true,
        items: 3,
        margin: 40,
        autoplay: false,
        autoplaySpeed: 1000,
        autoplayTimeout: 5000,
        smartSpeed: 450,
        nav: true,
        navText: ["<i class='owl-custom ion-chevron-left'></i>", "<i class='owl-custom ion-chevron-right'></i>"],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1024: {
                items: 1
            },
			1920: {
                items: 3
            }
        }
    });
    
});
