import barba from '@barba/core';
import gsap from 'gsap';
import $ from 'jquery';
import delay from './utils/dom';
import 'babel-polyfill'
import  '../images/bg-1.jpg'
import  '../images/bg-4.jpg'

const 
    preloader = document.getElementById('preloader'),
    preloaderInner = document.getElementById('preloader-inner');

function PJAXPrepare() {
    gsap.timeline().set(preloader, {
        opacity: 1, 
        visibility: 'visible',
    });
    gsap.timeline().set(preloaderInner, {
        scaleX: 0,
        transformOrigin: 'left center'
    })
}

function PJAXinitPage(){
   console.log('you could init there some shit');
}

function PJAXCalcPositionTop(){
    return $('.shit').get(0).getBoundingClientRect().top;
}

function CloneImage(data, selector){
    let 
        target = $(data.trigger),
        img = selector ? selector : target.find('img[src]'),
        body = $('body'),
        clone = img.clone(),
        imgPosition = img.get(0).getBoundingClientRect();

    clone.appendTo(body);
    clone.addClass('is-clone');
    gsap.timeline()
        .set(clone, {
            position: 'fixed',
            top: 0,
            left: 0,
            x: imgPosition.left,
            y: imgPosition.top,
			zIndex: 300
        })
}

const PJAXTransitionBlock = {
    name: 'simple',
	custom: ({
		current,
		next,
		trigger
	}) => {
        return $(trigger).data('pjax-link') == 'simple';
	},
    async leave(data) {
    
        const done = this.async();

        await PJAXPrepare();


        gsap.timeline().to(preloaderInner, {
            scaleX: 1,
            transformOrigin: 'left center',
            ease: 'Expo.easeInOut'
        })

        await delay(1000);

        done();

    },

    enter() {

        gsap.timeline().to(preloaderInner, {
            scaleX: 0,
            transformOrigin: 'right center',
            ease: 'Expo.easeInOut'
        })

    },

    afterEnter() {
        return PJAXinitPage();
    },

}

const PJAXTransitionImage = {
    name: 'image',
	custom: ({
		current,
		next,
		trigger
	}) => {
        return $(trigger).data('pjax-link') == 'image';
    },

    async leave(data) {
    
        const done = this.async();

        await CloneImage(data);

        console.log('shit anim')

        let clone = $('.is-clone');

        gsap.timeline()
            .to(clone, {
                x: 0,
                y: 0,
                width: '100%',
                height: '100%',
                duration: 0.8,
                ease: 'Expo.easeInOut',
            });


        await delay(1000);

        done();

    },

    async enter(data) {
        return PJAXinitPage();
    },

    async afterEnter(data) {
        await delay(500);
        PJAXAnimateNewImg(data);
    },

}

function PJAXAnimateNewImg(data){
    let 
        nextContainer = $(data.next.container),
        clone = $('.is-clone'),
        newImg = nextContainer.find('.shit'),
        newImagePosition = newImg.get(0).getBoundingClientRect();

    gsap.timeline()  
        .to(clone, {
            x: newImagePosition.left,
            y: PJAXCalcPositionTop,
            width: newImagePosition.width,
            height: newImagePosition.height,
            duration: 0.8,
            ease: 'Expo.easeInOut',
        })
        .add(
            function(){
                clone.remove();
            }
        );
}

const PJAX = function() {
    barba.init({

        sync: true,
    
        transitions: [
            PJAXTransitionBlock,
            PJAXTransitionImage
        ]
    });
}

new PJAX();
