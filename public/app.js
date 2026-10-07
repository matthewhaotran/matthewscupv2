const RULES = {
  A: ['Waterfall', 'Everyone drinks. Start with the drawer; nobody stops until the person before them does.'],
  2: ['You', 'Pick someone to drink.'],
  3: ['Me', 'The drawer drinks.'],
  4: ['Floor', 'Last person to touch the floor drinks.'],
  5: ['Thumb Master', 'Last to copy the thumb master’s thumb drinks.'],
  6: ['Pick a side', 'Split the group in two. One side drinks.'],
  7: ['Heaven', 'Last to point at the sky drinks.'],
  8: ['Mate', 'Pick a drinking buddy. They drink whenever you do.'],
  9: ['Rhyme', 'Say a word. Go around rhyming; first to fail drinks.'],
  10: ['Categories', 'Pick a category. First to stall drinks.'],
  J: ['Never have I ever', 'Say something you have never done. Anyone who has, drinks.'],
  Q: ['Question master', 'Anyone who answers your questions drinks, until the next queen.'],
  K: ['King’s cup', 'Pour some of your drink into the cup. The fourth king drinks it all.']
};
const SUITS = [['♠', false], ['♥', true], ['♣', false], ['♦', true]];
const RANKS = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
const $ = id => document.getElementById(id);
let deck = [], kings = 0, shown = false, done = false;

function newGame() {
  deck = [];
  for (const [s, red] of SUITS) for (const r of RANKS) deck.push({ r, s, red });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  kings = 0; shown = false; done = false;
  $('front').hidden = true;
  $('card').classList.remove('open');
  $('card').setAttribute('aria-label', 'Flip the next card');
  $('hint').textContent = 'Tap the card to flip it';
  $('next').textContent = 'Draw card';
  $('next').disabled = false;
  render();
}

function render() {
  $('left').textContent = deck.length;
  document.querySelectorAll('#kings i').forEach((el, i) => el.classList.toggle('on', i < kings));
}

function draw() {
  if (done) return;
  if (!deck.length) { done = true; $('hint').textContent = 'Deck empty. Start a new game.'; $('next').disabled = true; return; }
  const c = deck.pop();
  const [title, text] = RULES[c.r];
  const f = $('front');
  f.hidden = false;
  $('card').classList.add('open');
  f.classList.toggle('red', c.red);
  $('rank').textContent = $('rank2').textContent = c.r;
  $('suit').textContent = $('suit2').textContent = c.s;
  $('title').textContent = title;
  $('text').textContent = text;
  f.classList.remove('flip'); void f.offsetWidth; f.classList.add('flip');
  $('card').setAttribute('aria-label', `${c.r} of ${c.s}: ${title}. ${text}. Tap to draw the next card.`);
  if (c.r === 'K') kings++;
  if (kings === 4) {
    done = true;
    $('title').textContent = 'Drink the cup!';
    $('text').textContent = 'Fourth king. Finish the King’s cup. Game over.';
    $('hint').textContent = 'Game over.';
    $('next').disabled = true;
  } else {
    $('hint').textContent = 'Tap the card for the next one';
    $('next').textContent = 'Next card';
  }
  render();
}

$('card').addEventListener('click', draw);
$('next').addEventListener('click', draw);
$('reset').addEventListener('click', newGame);
$('rulesBtn').addEventListener('click', () => $('rules').showModal());
$('rulesList').innerHTML = Object.entries(RULES)
  .map(([k, [t, d]]) => `<li><b>${k}</b><span><strong>${t}</strong>${d}</span></li>`).join('');
newGame();
