'use strict';

const TIMING = {
  ANIMATION_DELAY: 2500,
  BAR_ANIMATION_DELAY: 3800,         // Loading bar effect
  BAR_WAITING: 800,                  // 3800 - 3000 (transition duration)
  LETTERS_DELAY: 50,                 // Letters effect
  TYPE_LETTERS_DELAY: 150,           // Typing effect
  SELECTION_DURATION: 500,
  TYPE_ANIMATION_DELAY: 1300,
  REVEAL_DURATION: 600,              // Clip effect
  REVEAL_ANIMATION_DELAY: 1500
};

export default class Headline {
  constructor(el) {
    this.el = el;

    this.wordsWrapperEl = el.querySelector('.ah-words-wrapper');
    this.optionEls = this.wordsWrapperEl.querySelectorAll('.ah-option');

    this.mode = '';
    if (this.el.classList.contains('ah-type')) {
      this.mode = 'type';
    } else if (this.el.classList.contains('ah-clip')) {
      this.mode = 'clip';
    } else if (this.el.classList.contains('ah-letters')) {
      this.mode = 'letters';
    } else if (this.el.classList.contains('ah-loading-bar')) {
      this.mode = 'loadingbar';
    }

    this.wordIndex = 0;

    if (this.el.classList.contains('letters')) {
      this.singleLetters();
    }
  }

  /** Singles out letters for letter-level animation. */
  singleLetters() {
    const rotate2 = this.el.classList.contains('ah-rotate-2');

    for (let el of this.optionEls) {
      const letters = el.textContent.split('');
      const visible = el.classList.contains('ah-visible');

      let letterEls = [];
      for (let l of letters) {
        let letterEl = document.createElement('i');
        if (visible) {
          letterEl.className = 'ah-in';
        }

        if (rotate2) {
          let innerLetterEl = document.createElement('em');
          innerLetterEl.textContent = l;
          letterEl.appendChild(innerLetterEl);
        } else {
          letterEl.textContent = l;
        }

        el.appendChild(letterEl);
      }
    }
  }

  animate() {
    var duration = TIMING.ANIMATION_DELAY;
    const wwEl = this.wordsWrapperEl;

    if (this.mode === 'loadingbar') {
      duration = TIMING.BAR_ANIMATION_DELAY;
      setTimeout(() => {
        wwEl.classList.add('ah-loading');
      }, TIMING.BAR_WAITING);
    }

    else if (this.mode === 'clip') {
      wwEl.style.width = wwEl.offsetWidth + 10 + 'px';
    }

    else if (this.mode !== 'type') {
      let width = 0;
      for (let option of this.optionEls) {
        width = Math.max(width, option.offsetWidth);
      }
      wwEl.style.width = width + 'px';
    };

    setTimeout(() => {
      this.hideWord();
    }, duration);
  }

  hideWord(wordEl, nextWordEl) {
    const wordEl = this.optionEls[this.wordIndex];
    var nextEl = null;
    if (this.wordIndex === this.optionEls.length - 1) {
      nextEl = this.optionEls[0];
      this.wordIndex = 0;
    } else {
      nextEl = this.optionEls[this.wordIndex + 1];
      this.wordIndex++;
    }

    if (this.mode === 'type') {
      this.cssToggle(this.wordsWrapperEl, 'ah-selected', 'ah-waiting');

      setTimeout(() => {
        this.wordsWrapperEl.classList.remove('ah-selected');
        this.cssToggle(wordEl, 'ah-hidden', 'ah-visible');
        let is = wordEl.querySelectorAll('i');
        for (let i of is) {
          this.cssToggle(i, 'ah-out', 'ah-in');
        }
      }, TIMING.SELECTION_DURATION);

      setTimeout(() => {
        this.showWord(nextWord, typeLettersDelay);
      }, TIMING.TYPE_ANIMATION_DELAY);
    }

    else if (this.mode === 'letters') {
      var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
      hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
      showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
    }

    else if (this.mode === 'clip') {
      this.wordsWrapperEl.animate({ width : '2px' }, revealDuration, function(){
        this.switchWord(wordEl, nextEl);
        this.showWord(nextEl);
      });
    }

    else if (this.mode === 'loadingbar') {
      this.wordsWrapperEl.classList.remove('ah-loading');
      this.switchWord(wordEl, nextEl);

      setTimeout(() => {
        this.hideWord();
      }, TIMING.BAR_ANIMATION_DELAY);

      setTimeout(() => {
        this.wordsWrapperEl.classList.add('ah-loading');
      }, TIMING.BAR_WAITING);
    }

    else {
      this.switchWord(wordEl, nextEl);
      setTimeout(() => {
        this.hideWord();
      }, TIMING.ANIMATION_DELAY);
    }
  }

  showWord(wordEl, duration) {
    if (this.isType) {
      showLetter($word.find('i').eq(0), $word, false, duration);
      this.cssToggle(wordEl, 'ah-visible', 'ah-hidden');
    }

    else if (this.isClip) {
      this.wordsWrapperEl.animate({ 'width' : $word.width() + 10 }, revealDuration, () => {
        setTimeout(() => {
          this.hideWord(wordEl);
        }, TIMING.REVEAL_ANIMATION_DELAY);
      });
    }
  }

  hideLetter(letterEl, $word, $bool, duration) {
    this.cssToggle(letterEl, 'ah-out', 'ah-in');

    if (!$letter.is(':last-child')) {
      setTimeout(() => {
        this.hideLetter($letter.next(), $word, $bool, duration);
      }, duration);
    }

    else if ($bool) {
      setTimeout(() => {
        this.hideWord(takeNext($word));
      }, animationDelay);
    }
  }

  /**
   * Shows the specified letter.
   */
  showLetter(letterEl, $word, $bool, $duration) {
    this.cssToggle(letterEl, 'ah-in', 'ah-out');
    if (!$letter.is(':last-child')) {
      setTimeout(() => {
        this.showLetter($letter.next(), $word, $bool, $duration);
      }, $duration);
    } else {
      if (this.mode === 'type') {
        setTimeout(() => {
          this.wordsWrapperEl.classList.add('ah-waiting');
        }, 200);
      }

      if(!$bool) { setTimeout(() => { hideWord($word) }, animationDelay) }
    }
  }

  /**
   * Adds a class and removes a class from a DOM element.
   *
   * @param {Element} el The element to manipulate.
   * @param {string} add The class to add.
   * @param {string} remove The class to remove.
   */
  cssToggle(el, add, remove) {
    el.classList.remove(remove);
    el.classList.add(add);
  }

  /**
   * Switches from the old word to the new word.
   *
   * @param {Element} oldWordEl The old word element.
   * @param {Element} newWordEl The new word element.
   */
  switchWord(oldWordEl, newWordEl) {
    this.cssToggle(oldWordEl, 'ah-hidden', 'ah-visible');
    this.cssToggle(newWordEl, 'ah-visible', 'ah-hidden');
  }
}
