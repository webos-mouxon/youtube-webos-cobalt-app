/*global navigate*/
// import './spatial-navigation-polyfill.js';
import {
  configAddChangeListener,
  configRead,
  configWrite,
  configGetDesc
} from './config.js';
import './ui.css';

import './navigation-checkbox.js';
import { checkboxTools } from './checkboxTools.js';

let lastTabIndex = 0;


// We handle key events ourselves.
window.__spatialNavigation__.keyMode = 'NONE';

const ARROW_KEY_CODE = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

// Red, Green, Yellow, Blue
// 403,   404,    405,  406
// ---,   172,    170,  191
const colorCodeMap = new Map([
  [403, 'red'],

  [404, 'green'],
  [172, 'green'],

  [405, 'yellow'],
  [170, 'yellow'],

  [406, 'blue'],
  [191, 'blue']
]);

/**
 * Returns the name of the color button associated with a code or null if not a color button.
 * @param {number} charCode KeyboardEvent.charCode property from event
 * @returns {string | null} Color name or null
 */
function getKeyColor(charCode) {
  if (colorCodeMap.has(charCode)) {
    return colorCodeMap.get(charCode);
  }

  return null;
}

// function createConfigCheckbox(key) {
//   const elmInput = document.createElement('input');
//   elmInput.type = 'checkbox';
//   elmInput.checked = configRead(key);

//   /** @type {(evt: Event) => void} */
//   const changeHandler = (evt) => {
//     configWrite(key, evt.target.checked);
//   };

//   elmInput.addEventListener('change', changeHandler);

//   configAddChangeListener(key, (evt) => {
//     elmInput.checked = evt.detail.newValue;
//   });

//   const elmLabel = document.createElement('label');
//   elmLabel.appendChild(elmInput);
//   // Use non-breaking space (U+00A0)
//   elmLabel.appendChild(document.createTextNode('\u00A0' + configGetDesc(key)));

//   return elmLabel;
// }

/*
function createOptionsPanel() {
  const elmContainer = document.createElement('div');

  elmContainer.classList.add('ytaf-ui-container');
  elmContainer.style['display'] = 'none';
  elmContainer.setAttribute('tabindex', 0);

  elmContainer.addEventListener(
    'focus',
    () => console.info('Options panel focused!'),
    true
  );
  elmContainer.addEventListener(
    'blur',
    () => console.info('Options panel blurred!'),
    true
  );

  elmContainer.addEventListener(
    'keydown',
    (evt) => {
      console.info('Options panel key event:', evt.type, evt.charCode);

      if (getKeyColor(evt.charCode) === 'green') {
        return;
      }

      if (evt.keyCode in ARROW_KEY_CODE) {
        navigate(ARROW_KEY_CODE[evt.keyCode]);
      } else if (evt.keyCode === 13) {
        // "OK" button

        // The YouTube app generates these "OK" events from clicks (including
        // with the Magic Remote), and we don't want to send a duplicate click
        // event for those. It seems isTrusted is only true for "real" events.
        if (evt.isTrusted === true) {
          document.activeElement.click();
        }
      } else if (evt.keyCode === 27) {
        // Back button
        showOptionsPanel(false);
      }

      evt.preventDefault();
      evt.stopPropagation();
    },
    true
  );

  const elmHeading = document.createElement('h1');
  elmHeading.textContent = 'webOS YouTube Extended';
  elmContainer.appendChild(elmHeading);

  elmContainer.appendChild(createConfigCheckbox('enableAdBlock'));
  elmContainer.appendChild(createConfigCheckbox('hideLogo'));
  elmContainer.appendChild(createConfigCheckbox('removeShorts'));
  elmContainer.appendChild(createConfigCheckbox('enableSponsorBlock'));

  const elmBlock = document.createElement('blockquote');

  elmBlock.appendChild(createConfigCheckbox('enableSponsorBlockSponsor'));
  elmBlock.appendChild(createConfigCheckbox('enableSponsorBlockIntro'));
  elmBlock.appendChild(createConfigCheckbox('enableSponsorBlockOutro'));
  elmBlock.appendChild(createConfigCheckbox('enableSponsorBlockInteraction'));
  elmBlock.appendChild(createConfigCheckbox('enableSponsorBlockSelfPromo'));
  elmBlock.appendChild(createConfigCheckbox('enableSponsorBlockMusicOfftopic'));

  elmContainer.appendChild(elmBlock);

  const elmSponsorLink = document.createElement('div');
  elmSponsorLink.innerHTML =
    '<small>Sponsor segments skipping - https://sponsor.ajay.app</small>';
  elmContainer.appendChild(elmSponsorLink);

  return elmContainer;
}

const optionsPanel = createOptionsPanel();
document.body.appendChild(optionsPanel);

let optionsPanelVisible = false;
*/

/**
 * Show or hide the options panel.
 * @param {boolean} [visible=true] Whether to show the options panel.
 */
/*
function showOptionsPanel(visible) {
  visible ??= true;

  if (visible && !optionsPanelVisible) {
    console.info('Showing and focusing options panel!');
    optionsPanel.style.display = 'block';
    optionsPanel.focus();
    optionsPanelVisible = true;
  } else if (!visible && optionsPanelVisible) {
    console.info('Hiding options panel!');
    optionsPanel.style.display = 'none';
    optionsPanel.blur();
    optionsPanelVisible = false;
  }
}

window.ytaf_showOptionsPanel = showOptionsPanel;

const eventHandler = (evt) => {
  console.info(
    'Key event:',
    evt.type,
    evt.charCode,
    evt.keyCode,
    evt.defaultPrevented
  );

  if (getKeyColor(evt.charCode) === 'green') {
    console.info('Taking over!');

    evt.preventDefault();
    evt.stopPropagation();

    if (evt.type === 'keydown') {
      // Toggle visibility.
      showOptionsPanel(!optionsPanelVisible);
    }
    return false;
  }
  return true;
};

document.addEventListener('keydown', eventHandler, true);
document.addEventListener('keypress', eventHandler, true);
document.addEventListener('keyup', eventHandler, true);
*/

function callbackConfig(configName) {
  return (newState) => {
    configWrite(configName, newState);
  };
};

function createConfigCheckboxCobalt(key, callback) {
  if (callback == null) {
    callback = callbackConfig(key)
  }
  return checkboxTools.add(
    '__' + key,
    configGetDesc(key),
    configRead(key),
    callback
  )
}

function createOptionsPanelCobalt() {
  const uiContainer = document.createElement('div');
  uiContainer.classList.add('ytaf-ui-container');
  uiContainer.style.display = 'none';
  uiContainer.setAttribute('tabindex', 0);
  uiContainer.addEventListener(
    'focus',
    () => {
      console.info('uiContainer focused!');
      const tabIndex = document.querySelector(':focus').tabIndex;
      if (tabIndex !== null) {
        lastTabIndex = tabIndex;
      }
    },
    true
  );
  uiContainer.addEventListener(
    'blur',
    () => console.info('uiContainer blured!'),
    true
  );

  uiContainer.addEventListener(
    'keydown',
    (evt) => {
      console.info(
        'uiContainer key event:',
        evt.type,
        evt.charCode,
        evt.keyCode
      );

      if (getKeyColor(evt.charCode) !== 'green') {
        if (evt.keyCode in ARROW_KEY_CODE) {
          if (uiContainer.offsetParent !== null) {
            navigate(ARROW_KEY_CODE[evt.keyCode]);
          }
        } else if (evt.keyCode === 13 || evt.keyCode === 32) {
          // "OK" button
          checkboxTools.toggleCheck(document.querySelector(':focus').id);
        } else if (evt.keyCode === 27) {
          // Back button
          closeContainer();
        }
        evt.preventDefault();
        evt.stopPropagation();
      }
    },
    true
  );

  const divTitle = document.createElement('div');
  divTitle.classList.add('center');
  divTitle.innerHTML = `<h1>webOS YouTube Extended</h1>`;
  uiContainer.appendChild(divTitle);

  uiContainer.appendChild(createConfigCheckboxCobalt('enableAdBlock'))
  uiContainer.appendChild(createConfigCheckboxCobalt('hideLogo', (newState) => {
    configWrite('hideLogo', newState);
    logoHideShow();
  }
  ))
  uiContainer.appendChild(createConfigCheckboxCobalt('removeShorts'))
  uiContainer.appendChild(createConfigCheckboxCobalt('enableSponsorBlock'))

  const sponsorBlock = document.createElement('div');
  sponsorBlock.classList.add('blockquote');
  sponsorBlock.appendChild(createConfigCheckboxCobalt('enableSponsorBlockSponsor'))
  sponsorBlock.appendChild(createConfigCheckboxCobalt('enableSponsorBlockIntro'))
  sponsorBlock.appendChild(createConfigCheckboxCobalt('enableSponsorBlockOutro'))
  sponsorBlock.appendChild(createConfigCheckboxCobalt('enableSponsorBlockInteraction'))
  sponsorBlock.appendChild(createConfigCheckboxCobalt('enableSponsorBlockSelfPromo'))
  sponsorBlock.appendChild(createConfigCheckboxCobalt('enableSponsorBlockMusicOfftopic'))
  uiContainer.appendChild(sponsorBlock);

  const sponsorLink = document.createElement('div');
  sponsorLink.classList.add('small');
  sponsorLink.innerHTML = `Sponsor segments skipping - https://sponsor.ajay.app`;
  uiContainer.appendChild(sponsorLink);

  return uiContainer
}

let uiContainer = createOptionsPanelCobalt();

let latestFocus = null;
function openContainer() {
  console.info('Container: Showing & Focusing!');
  uiContainer.style.display = 'block';
  latestFocus = document.querySelector(':focus');
  document.querySelector('[tabindex="' + lastTabIndex + '"]').focus();
  keepContainerFocus();
}

function keepContainerFocus() {
  if (uiContainer.offsetParent !== null) {
    if (
      !uiContainer.matches(':focus') &&
      uiContainer.querySelector(':focus') == null
    ) {
      latestFocus = document.querySelector(':focus');
      console.info('Container: Not have focus: Focusing!');
      document.querySelector('[tabindex="' + lastTabIndex + '"]').focus();
    }

    setTimeout(keepContainerFocus, 100);
  }
}

function closeContainer() {
  console.info('Container: Hiding!');
  uiContainer.style.display = 'none';
  uiContainer.blur();
  if (latestFocus != null) {
    latestFocus.focus();
  }
}

function logoHideShow() {
  var logo = document.querySelector('ytlr-redux-connect-ytlr-logo-entity');
  if (logo != null) {
    logo.style.visibility = configRead('hideLogo')
      ? 'hidden'
      : 'visible';
  }
}

const eventHandler = (evt) => {
  console.info(
    'Key event:',
    evt.type,
    evt.charCode,
    evt.keyCode,
    evt.defaultPrevented
  );
  if (getKeyColor(evt.charCode) === 'green') {
    console.info('Taking over!');
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.type === 'keydown') {
      if (uiContainer.style.display === 'none') {
        openContainer();
      } else {
        closeContainer();
      }
    }
    return false;
  } else if (
    evt.type === 'keydown' &&
    evt.charCode == 0 &&
    evt.keyCode == 187
  ) {
    // char '='
    if (uiContainer.style.display === 'none') {
      openContainer();
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      closeContainer();
      evt.preventDefault();
      evt.stopPropagation();
    }
  }
  return true;
};

export function showNotification(text, time = 3000) {
  console.info('Show notification: ' + text);
  if (!document.querySelector('.ytaf-notification-container')) {
    console.info('Adding notification container');
    const c = document.createElement('div');
    c.classList.add('ytaf-notification-container');
    document.body.appendChild(c);
  }

  const elm = document.createElement('div');
  const elmInner = document.createElement('div');
  elmInner.innerHTML = text;
  elmInner.classList.add('message');
  elmInner.classList.add('message-hidden');
  elm.appendChild(elmInner);
  document.querySelector('.ytaf-notification-container').appendChild(elm);

  setTimeout(() => {
    elmInner.classList.remove('message-hidden');
  }, 100);
  setTimeout(() => {
    elmInner.classList.add('message-hidden');
    setTimeout(() => {
      document.querySelector('.ytaf-notification-container').removeChild(elm);
    }, 1000);
  }, time);
}

/**
 * Initialize ability to hide YouTube logo in top right corner.
 */
// function initHideLogo() {
//   const style = document.createElement('style');
//   document.head.appendChild(style);

//   /** @type {(hide: boolean) => void} */
//   const setHidden = (hide) => {
//     const visibility = hide ? 'hidden' : 'visible';
//     style.textContent = `ytlr-redux-connect-ytlr-logo-entity { visibility: ${visibility}; }`;
//   };

//   setHidden(configRead('hideLogo'));

//   configAddChangeListener('hideLogo', (evt) => {
//     setHidden(evt.detail.newValue);
//   });
// }

function applyUIFixes() {
  try {
    const bodyClasses = document.body.classList;

    const observer = new MutationObserver(function bodyClassCallback(
      _records,
      _observer
    ) {
      try {
        if (bodyClasses.contains('app-quality-root')) {
          bodyClasses.remove('app-quality-root');
        }
      } catch (e) {
        console.error('error in <body> class observer callback:', e);
      }
    });

    observer.observe(document.body, {
      subtree: false,
      childList: false,
      attributes: true,
      attributeFilter: ['class'],
      characterData: false
    });
  } catch (e) {
    console.error('error setting up <body> class observer:', e);
  }
}


document.querySelector('body').appendChild(uiContainer);

document.addEventListener('keydown', eventHandler, true);
document.addEventListener('keypress', eventHandler, true);
document.addEventListener('keyup', eventHandler, true);

applyUIFixes();
// initHideLogo();

setTimeout(() => {
  showNotification('Press [GREEN] to open YTAF configuration screen');
}, 2000);

logoHideShow();
setTimeout(() => {
  logoHideShow();
}, 4000);
