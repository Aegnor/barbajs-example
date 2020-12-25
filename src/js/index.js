import 'babel-polyfill'
import gsap from 'gsap'
import barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'

import './images.js'

const
    $body = document.querySelector('body'),
    $preloader = document.getElementById('preloader'),
    $preloaderInner = document.getElementById('preloader-inner'),
    gsapTl = gsap.timeline({
        defaults: {
            duration: 0.8,
            ease: 'Expo.easeInOut'
        }
    })

function pjaxAnimateNewImg(data) {
    const
        $clone = document.querySelector('.is-clone'),
        newImagePosition = data.next.container.querySelector('.js-image-clone-place').getBoundingClientRect()

    gsapTl.to($clone, {
        x: newImagePosition.left,
        y: newImagePosition.top,
        width: newImagePosition.width,
        height: newImagePosition.height
    }).add(
        () => {
            $clone.remove()
        }
    )
}

barba.hooks.enter(() => {
    window.scrollTo(0, 0)
})

barba.use(barbaPrefetch)

barba.init({
    transitions: [
        {
            name: 'block-slide',
            custom: ({trigger}) => trigger.dataset.pjaxLink === 'block-slide',
            leave() {
                gsapTl.set($preloader, {
                    opacity: 1,
                    visibility: 'visible'
                })

                gsapTl.set($preloaderInner, {
                    scaleX: 0,
                    transformOrigin: 'left center'
                })

                gsapTl.to($preloaderInner, {
                    scaleX: 1,
                    transformOrigin: 'left center'
                })

                return gsapTl
            },
            after() {
                gsapTl.to($preloaderInner, {
                    scaleX: 0,
                    transformOrigin: 'right center'
                })

                return gsapTl
            }
        },
        {
            name: 'image',
            custom: ({trigger}) => trigger.dataset.pjaxLink === 'image',
            leave({trigger}) {
                const
                    $img = trigger.querySelector('img[src]'),
                    $imgClone = $img.cloneNode(),
                    imgPosition = $img.getBoundingClientRect()

                $body.append($imgClone)
                $imgClone.classList.add('is-clone')

                gsapTl.set($imgClone, {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: imgPosition.left,
                    y: imgPosition.top,
                    zIndex: 300
                })

                gsapTl.to($imgClone, {
                    x: 0,
                    y: 0,
                    width: '100%',
                    height: '100%'
                })

                return gsapTl
            },
            after(data) {
                return pjaxAnimateNewImg(data)
            }
        }
    ]
})
