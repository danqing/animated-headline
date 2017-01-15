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

    this.isType = this.el.classList.contains('type');
    this.isClip = this.el.classList.contains('clip');

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

    if (this.el.classList.contains('loading-bar')) {
      duration = TIMING.BAR_ANIMATION_DELAY;
      setTimeout(() => {
        wwEl.classList.add('ah-loading');
      }, TIMING.BAR_WAITING);
    }

    else if (this.isClip) {
      wwEl.style.width = wwEl.offsetWidth + 10 + 'px';
    }

    else if (!this.isType) {
      let width = 0;
      for (let option of this.optionEls) {
        width = Math.max(width, option.offsetWidth);
      }
      wwEl.style.width = width + 'px';
    };

    setTimeout(() => {
      this.hideWord(headline.find('.is-visible').eq(0));
    }, duration);
  }

  hideWord(wordEl, nextWordEl) {
    if ($word.parents('.cd-headline').hasClass('type')) {
      var parentSpan = $word.parent('.cd-words-wrapper');
      parentSpan.addClass('selected').removeClass('waiting');
      setTimeout(function(){
        parentSpan.removeClass('selected');
        $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
      }, selectionDuration);
      setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

    } else if ($word.parents('.cd-headline').hasClass('letters')) {
      var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
      hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
      showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

    }  else if($word.parents('.cd-headline').hasClass('clip')) {
      $word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
        switchWord($word, nextWord);
        showWord(nextWord);
      });

    } else if ($word.parents('.cd-headline').hasClass('loading-bar')){
      $word.parents('.cd-words-wrapper').removeClass('is-loading');
      switchWord($word, nextWord);
      setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
      setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

    } else {
      switchWord($word, nextWord);
      setTimeout(function(){ hideWord(nextWord) }, animationDelay);
    }
  }

  showWord($word, $duration) {
    if($word.parents('.cd-headline').hasClass('type')) {
      showLetter($word.find('i').eq(0), $word, false, $duration);
      $word.addClass('is-visible').removeClass('is-hidden');

    }  else if($word.parents('.cd-headline').hasClass('clip')) {
      $word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
        setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
      });
    }
  }

  hideLetter(letterEl, $word, $bool, duration) {
    letterEl.classList.remove('ah-in');
    letterEl.classList.add('ah-out');

    if (!$letter.is(':last-child')) {
      setTimeout(() => {
        hideLetter($letter.next(), $word, $bool, duration);
      }, duration);
    } else if($bool) {
      setTimeout(() => {
        hideWord(takeNext($word));
      }, animationDelay);
    }

    if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
      var nextWord = takeNext($word);
      switchWord($word, nextWord);
    }
  }

  showLetter($letter, $word, $bool, $duration) {
    $letter.addClass('in').removeClass('out');

    if(!$letter.is(':last-child')) {
      setTimeout(() => {
        showLetter($letter.next(), $word, $bool, $duration);
      }, $duration);
    } else {
      if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
      if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
    }
  }

  /**
   * Switches from the old word to the new word.
   *
   * @param {Element} oldWord The old word element.
   * @param {Element} newWord The new word element.
   */
  switchWord(oldWord, newWord) {
    oldWord.classList.remove('ah-visible');
    oldWord.classList.add('ah-hidden');
    newWord.classList.remove('ah-hidden');
    newWord.classList.add('ah-visible');
  }
}
