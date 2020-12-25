import 'babel-polyfill'
import $ from 'jquery'
import gsap from 'gsap'
import barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'

import './images.js'

const
    preloader = document.getElementById('preloader'),
    preloaderInner = document.getElementById('preloader-inner'),
    gsapTl = gsap.timeline()

function cloneImage(data, selector) {
    const
        img = selector ? selector : $(data.trigger).find('img[src]'),
        $clone = img.clone(),
        imgPosition = img.get(0).getBoundingClientRect()

    $clone.appendTo($('body'))
    $clone.addClass('is-clone')
    gsapTl.set($clone, {
        position: 'fixed',
        top: 0,
        left: 0,
        x: imgPosition.left,
        y: imgPosition.top,
        zIndex: 300
    })
}

function pjaxAnimateNewImg(data) {
    const
        $clone = $('.is-clone'),
        newImagePosition = $(data.next.container).find('.shit').get(0).getBoundingClientRect()

    gsapTl.to($clone, {
        x: newImagePosition.left,
        y: newImagePosition.top,
        width: newImagePosition.width,
        height: newImagePosition.height,
        duration: 0.8,
        ease: 'Expo.easeInOut'
    }).add(
        () => {
            $clone.remove()
        }
    )
}

const pjaxTransitionBlock = {
    name: 'simple',
    custom: ({trigger}) => $(trigger).data('pjax-link') === 'simple',
    leave() {
        gsapTl.set(preloader, {
            opacity: 1,
            visibility: 'visible'
        })

        gsapTl.set(preloaderInner, {
            scaleX: 0,
            transformOrigin: 'left center'
        })

        gsapTl.to(preloaderInner, {
            scaleX: 1,
            transformOrigin: 'left center',
            duration: 0.8,
            ease: 'Expo.easeInOut'
        })
    },
    enter() {

        gsapTl.to(preloaderInner, {
            scaleX: 0,
            transformOrigin: 'right center',
            duration: 0.8,
            ease: 'Expo.easeInOut'
        })

    }
}

const pjaxTransitionImage = {
    name: 'image',
    custom: ({trigger}) => $(trigger).data('pjax-link') === 'image',
    leave(data) {
        cloneImage(data)
        gsapTl.to('.is-clone', {
            x: 0,
            y: 0,
            width: '100%',
            height: '100%',
            duration: 0.8,
            ease: 'Expo.easeInOut'
        })
    },
    after(data) {
        return pjaxAnimateNewImg(data)
    }
}

barba.use(barbaPrefetch)

barba.init({
    transitions: [
        pjaxTransitionBlock,
        pjaxTransitionImage
    ]
})
