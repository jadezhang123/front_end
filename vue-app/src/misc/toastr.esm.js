/*
 * Toastr (自改版)
 * Copyright 2012-2015
 * Authors: John Papa, Hans Fjällemark, and Tim Ferrell.
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * ARIA Support: Greta Krafsig
 *
 * Project: https://github.com/CodeSeven/toastr
 */
import $ from 'jquery'

var DEFAULTS = {
  debug: false,
  tapToDismiss: true,
  containerId: 'toast-container',
  wrapperClass: 'toast-wrapper',
  toastClass: 'toast',

  onShown: undefined,
  onHidden: undefined,
  closeMethod: false,
  closeDuration: false,
  closeEasing: false,
  closeOnHover: true,

  extendedTimeOut: 1000,
  iconClasses: {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning'
  },
  iconClass: 'toast-info',
  positionClass: 'toast-top-right',
  timeOut: 5000, // Set timeOut and extendedTimeOut to 0 to make it sticky
  titleClass: 'toast-title',
  messageClass: 'toast-message',
  escapeHtml: false,
  target: 'body',
  closeHtml: '<span>&times</span>',
  closeClass: 'toast-close-button',
  newestOnTop: true,
  preventDuplicates: false,
  progressBar: false,
  progressClass: 'toast-progress',
  rtl: false
}

const toastr = function () {
  var $container
  var listener
  var toastId = 0
  var previousToast

  var toastr = {
    clear: clear,
    remove: remove,
    error: error,
    getContainer: getContainer,
    info: info,
    options: {},
    subscribe: subscribe,
    success: success,
    version: '2.1.3',
    warning: warning
  }

  return toastr

  function getContainer (options) {
    if ($container) return $container
    if (!options) { options = getOptions() }
    $container = $('#' + options.containerId)
    if (!$container.length) {
      $container = $('<div>')
          .attr('id', options.containerId)
          .addClass(options.positionClass)
          .appendTo($(options.target))
    }
    return $container
  }

  function success (message, title, optionsOverride) {
    return notify({
      type: 'success',
      iconClass: getOptions().iconClasses.success,
      message: message,
      optionsOverride: optionsOverride,
      title: title
    })
  }

  function warning (message, title, optionsOverride) {
    return notify({
      optionsOverride: optionsOverride,
      iconClass: getOptions().iconClasses.warning,
      type: 'warning',
      message: message,
      title: title
    })
  }

  function error (message, title, optionsOverride) {
    return notify({
      type: 'error',
      iconClass: getOptions().iconClasses.error,
      message: message,
      optionsOverride: optionsOverride,
      title: title
    })
  }

  function info (message, title, optionsOverride) {
    return notify({
      type: 'info',
      iconClass: getOptions().iconClasses.info,
      message: message,
      optionsOverride: optionsOverride,
      title: title
    })
  }

  function subscribe (callback) {
    listener = callback
  }

  function remove ($toastElement) {
    var options = getOptions()
    if (!$container) { getContainer(options) }
    if ($toastElement && $(':focus', $toastElement).length === 0) {
      removeToast($toastElement)
    }
  }

  function clear ($toastElement, clearOptions) {
    var options = getOptions()
    if (!$container) { getContainer(options) }
    if (!clearToast($toastElement, options, clearOptions)) {
      clearContainer(options)
    }
  }

  // internal functions

  function clearContainer (options) {
    var toastsToClear = $container.children()
    for (var i = toastsToClear.length - 1; i >= 0; i--) {
      clearToast($(toastsToClear[i]), options)
    }
  }

  function clearToast ($toastElement, options, clearOptions) {
    var force = clearOptions && clearOptions.force ? clearOptions.force : false
    if ($toastElement && (force || $(':focus', $toastElement).length === 0)) {
      removeToast($toastElement)
      return true
    }
    return false
  }

  function removeToast ($toastElement) {
    $toastElement.removeClass('active')
    setTimeout(function () {
      $toastElement.parent().remove()
      $toastElement = null
    }, 268)
    if ($container.children().length === 0) {
      previousToast = undefined
    }
  }

  function publish (args) {
    listener && listener(args)
  }

  function getOptions () {
    return $.extend({}, DEFAULTS, toastr.options)
  }

  function notify (map) {
    var options = getOptions()
    var iconClass = map.iconClass || options.iconClass

    if (typeof (map.optionsOverride) !== 'undefined') {
      options = $.extend(options, map.optionsOverride)
      iconClass = map.optionsOverride.iconClass || iconClass
    }

    if (shouldExit(options, map)) {
      return
    }

    toastId++

    $container = getContainer(options)

    var intervalId = null
    var $toastElement = $('<div/>')
    var $titleElement = $('<div/>')
    var $messageElement = $('<div/>')
    var $progressElement = $('<div/>')
    var $closeElement = $(options.closeHtml)
    var progressBar = {
      intervalId: null,
      hideEta: null,
      maxHideTime: null
    }
    var response = {
      toastId: toastId,
      state: 'visible',
      startTime: new Date(),
      options: options,
      map: map
    }

    personalizeToast()

    displayToast()

    handleEvents()

    publish(response)

    if (options.debug && console) {
      console.log(response)
    }

    return $toastElement

    function personalizeToast () {
      setRTL()
      setAria()
      setIcon()
      setTitle()
      setMessage()
      setCloseButton()
      setProgressBar()
    }

    function displayToast () {
      var $wrapper = $('<div class="' + options.wrapperClass + '">')
      $wrapper.append($toastElement)

      $container[options.newestOnTop ? 'prepend' : 'append']($wrapper)
      setTimeout(function () {
        $toastElement.addClass('active')
      }, 15)
      options.onShown && options.onShown()
      if (options.timeOut > 0) {
        intervalId = setTimeout(hideToast, options.timeOut)
        progressBar.maxHideTime = parseFloat(options.timeOut)
        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime
        if (options.progressBar) {
          progressBar.intervalId = setInterval(updateProgress, 10)
        }
      }
    }

    function handleEvents () {
      if (options.closeOnHover) {
        $toastElement.hover(stickAround, delayedHideToast)
      }

      if (!options.onclick && options.tapToDismiss) {
        $toastElement.click(hideToast)
      }

      if (options.closeButton && $closeElement) {
        $closeElement.click(function (event) {
          if (event.stopPropagation) {
            event.stopPropagation()
          } else if (event.cancelBubble !== undefined && event.cancelBubble !== true) {
            event.cancelBubble = true
          }

          if (options.onCloseClick) {
            options.onCloseClick(event)
          }

          hideToast(true)
        })
      }

      if (options.onclick) {
        $toastElement.click(function (event) {
          options.onclick(event)
          hideToast()
        })
      }
    }

    function setRTL () {
      if (options.rtl) {
        $toastElement.addClass('rtl')
      }
    }

    function setAria () {
      var ariaValue = ''
      switch (map.iconClass) {
        case 'toast-success':
        case 'toast-info':
          ariaValue = 'polite'
          break
        default:
          ariaValue = 'assertive'
      }
      $toastElement.attr('aria-live', ariaValue)
    }

    function setIcon () {
      if (map.iconClass) {
        $toastElement.addClass(options.toastClass).addClass(iconClass)
      }
    }

    function setTitle () {
      if (map.title) {
        var suffix = map.title
        if (options.escapeHtml) {
          suffix = escapeHtml(map.title)
        }
        $titleElement.append(suffix).addClass(options.titleClass)
        $toastElement.append($titleElement)
      }
    }

    function setMessage () {
      if (map.message) {
        var suffix = map.message
        if (options.escapeHtml) {
          suffix = escapeHtml(map.message)
        }
        $messageElement.append(suffix).addClass(options.messageClass)
        $toastElement.append($messageElement)
      }
    }

    function setCloseButton () {
      if (options.closeButton) {
        $closeElement.addClass(options.closeClass).attr('role', 'button')
        $toastElement.prepend($closeElement)
      }
    }

    function setProgressBar () {
      if (options.progressBar) {
        $progressElement.addClass(options.progressClass)
        $toastElement.prepend($progressElement)
      }
    }

    function shouldExit (options, map) {
      if (options.preventDuplicates) {
        if (map.message === previousToast) {
          return true
        } else {
          previousToast = map.message
        }
      }
      return false
    }

    function hideToast (override) {
      if ($(':focus', $toastElement).length && !override) {
        return
      }
      removeToast($toastElement)
      clearTimeout(progressBar.intervalId)
      clearTimeout(intervalId)
      if (options.onHidden && response.state !== 'hidden') {
        options.onHidden()
      }
      response.state = 'hidden'
      response.endTime = new Date()
      publish(response)
    }

    function delayedHideToast () {
      if (options.timeOut > 0 || options.extendedTimeOut > 0) {
        intervalId = setTimeout(hideToast, options.extendedTimeOut)
        progressBar.maxHideTime = parseFloat(options.extendedTimeOut)
        progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime
      }
    }

    function stickAround () {
      clearTimeout(intervalId)
      progressBar.hideEta = 0
    }

    function updateProgress () {
      var percentage = ((progressBar.hideEta - (new Date().getTime())) / progressBar.maxHideTime) * 100
      $progressElement.width(percentage + '%')
    }

    function escapeHtml (source) {
      if (source == null) {
        source = ''
      }

      return source
          .replace(/&/g, '&amp')
          .replace(/"/g, '&quot')
          .replace(/'/g, '&#39')
          .replace(/</g, '&lt')
          .replace(/>/g, '&gt')
    }
  }
}

export default toastr()
