import barba from '@barba/core';
import gsap from 'gsap';
import 'babel-polyfill'

var 
    preloader = document.getElementById('preloader'),
    preloaderInner = document.getElementById('preloader-inner');

function delay(n) {
    n = n || 2000;
    return new Promise(done => {
        setTimeout(() => {
            done();
        }, n);
    });
}

function PJAXPrepare() {

    var 
        tl = gsap.timeline();

    tl.set(preloader, {
        opacity: 1, 
        visibility: 'visible',
    });

    tl.set(preloaderInner, {
        scaleX: 0,
        transformOrigin: 'left center'
    })

}

function PJAXinitPage(){
    console.log('init')
}

var PJAXTransitionBlock = {

    async leave(data) {
    
        const done = this.async();

        await PJAXPrepare();

        var 
        tl = gsap.timeline();

 
        tl.to(preloaderInner, {
            scaleX: 1,
            transformOrigin: 'left center',
            ease: 'Expo.easeInOut'
        })

        await delay(1000);

        done();

    },

    async enter(data) {
        var 
            tl = gsap.timeline();

        tl.to(preloaderInner, {
            scaleX: 0,
            transformOrigin: 'right center',
            ease: 'Expo.easeInOut'
        })

    },

    async afterEnter(data) {
        return PJAXinitPage();
    },

}

var PJAX = function() {
    barba.init({

        sync: true,
    
        transitions: [
            PJAXTransitionBlock
        ]
    });
}

new PJAX();