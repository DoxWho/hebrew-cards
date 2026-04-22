import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Settings, Play, Globe, ChevronRight, RotateCcw, BookOpen,
  Plus, Minus, Check, X, UserPlus, Layers, Volume2, Star,
  Lock, Unlock, Brain, GraduationCap, Sparkles, ArrowLeft,
  Eye, EyeOff, ChevronDown, ChevronUp, Trophy, Zap
} from 'lucide-react';

// ============================================================
// ██████╗  █████╗ ████████╗ █████╗
// ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
// ██║  ██║███████║   ██║   ███████║
// ██║  ██║██╔══██║   ██║   ██╔══██║
// ██████╔╝██║  ██║   ██║   ██║  ██║
// ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
// ============================================================

// visualType: 'standard' | 'ascender' | 'descender'
// confusableWith: array of ids for logic-based drills
const LETTERS = [
  { id: 'l1',  target: 'א', name: 'Aleph',      transliteration: 'Silent', category: 'Letters', visualType: 'standard',   confusableWith: ['l6','l21'], mnemonic: 'Aleph looks like a person doing yoga — two lines crossing.' },
  { id: 'l2',  target: 'בּ', name: 'Bet',        transliteration: 'B',      category: 'Letters', visualType: 'standard',   confusableWith: ['l3','l22'], mnemonic: 'Bet is like a house (Bayit) you can walk into from the right.' },
  { id: 'l3',  target: 'ב',  name: 'Vet',        transliteration: 'V',      category: 'Letters', visualType: 'standard',   confusableWith: ['l2','l23'], mnemonic: 'Vet is Bet without the dot — the door of the house is open.' },
  { id: 'l4',  target: 'ג',  name: 'Gimel',      transliteration: 'G',      category: 'Letters', visualType: 'standard',   confusableWith: ['l5','l4'],  mnemonic: 'Gimel looks like a person Going for a walk, leg extended.' },
  { id: 'l5',  target: 'ד',  name: 'Dalet',      transliteration: 'D',      category: 'Letters', visualType: 'standard',   confusableWith: ['l6','l28'], mnemonic: 'Dalet looks like a Door (Delet) with a slanted roof.' },
  { id: 'l6',  target: 'ה',  name: 'He',         transliteration: 'H',      category: 'Letters', visualType: 'standard',   confusableWith: ['l1','l9'],  mnemonic: 'He is like the letter Chet but with a gap on the left — exhale (Hey!).' },
  { id: 'l7',  target: 'ו',  name: 'Vav',        transliteration: 'V/W',    category: 'Letters', visualType: 'standard',   confusableWith: ['l11','l18'],mnemonic: 'Vav is a tiny vertical nail (Vav means hook).' },
  { id: 'l8',  target: 'ז',  name: 'Zayin',      transliteration: 'Z',      category: 'Letters', visualType: 'standard',   confusableWith: ['l7'],       mnemonic: 'Zayin looks like a sword (Zayin means weapon).' },
  { id: 'l9',  target: 'ח',  name: 'Chet',       transliteration: 'Ch',     category: 'Letters', visualType: 'standard',   confusableWith: ['l6','l10'], mnemonic: 'Chet has a complete roof — like a closed Chuppah (wedding canopy).' },
  { id: 'l10', target: 'ט',  name: 'Tet',        transliteration: 'T',      category: 'Letters', visualType: 'standard',   confusableWith: ['l9'],       mnemonic: 'Tet is like a basket tilted on its side, collecting Tov (good).' },
  { id: 'l11', target: 'י',  name: 'Yod',        transliteration: 'Y',      category: 'Letters', visualType: 'standard',   confusableWith: ['l7'],       mnemonic: 'Yod is the smallest letter — a tiny spark of divine energy.' },
  { id: 'l12', target: 'כּ', name: 'Kaf',        transliteration: 'K',      category: 'Letters', visualType: 'standard',   confusableWith: ['l13','l22'],mnemonic: 'Kaf looks like an open Palm (Kaf means palm of the hand).' },
  { id: 'l13', target: 'כ',  name: 'Chaf',       transliteration: 'Kh',     category: 'Letters', visualType: 'standard',   confusableWith: ['l12','l14'],mnemonic: 'Chaf is Kaf without the dot — a softer, breathier sound.' },
  { id: 'l14', target: 'ך',  name: 'Chaf Sofit', transliteration: 'Kh',     category: 'Letters', visualType: 'descender',  confusableWith: ['l13','l18'],mnemonic: 'Chaf Sofit drops below the line at the end of a word, like a long exhale.', isFinal: true, rootLetter: 'כ' },
  { id: 'l15', target: 'ל',  name: 'Lamed',      transliteration: 'L',      category: 'Letters', visualType: 'ascender',   confusableWith: ['l15'],      mnemonic: 'Lamed is the tallest letter — a tower for Learning (Lamed means learn).' },
  { id: 'l16', target: 'מ',  name: 'Mem',        transliteration: 'M',      category: 'Letters', visualType: 'standard',   confusableWith: ['l17','l20'],mnemonic: 'Mem looks like a closed square — still waters (Mayim means water).' },
  { id: 'l17', target: 'ם',  name: 'Mem Sofit',  transliteration: 'M',      category: 'Letters', visualType: 'standard',   confusableWith: ['l16'],      mnemonic: 'Mem Sofit is completely closed — the final drop of water.', isFinal: true, rootLetter: 'מ' },
  { id: 'l18', target: 'נ',  name: 'Nun',        transliteration: 'N',      category: 'Letters', visualType: 'standard',   confusableWith: ['l19','l7'], mnemonic: 'Nun looks like a small bent figure bowing in prayer.' },
  { id: 'l19', target: 'ן',  name: 'Nun Sofit',  transliteration: 'N',      category: 'Letters', visualType: 'descender',  confusableWith: ['l18','l14'],mnemonic: 'Nun Sofit straightens up and drops below the line at word\'s end.', isFinal: true, rootLetter: 'נ' },
  { id: 'l20', target: 'ס',  name: 'Samekh',     transliteration: 'S',      category: 'Letters', visualType: 'standard',   confusableWith: ['l16','l17'],mnemonic: 'Samekh is a perfect circle — Support (Samekh means support).' },
  { id: 'l21', target: 'ע',  name: 'Ayin',       transliteration: 'Silent', category: 'Letters', visualType: 'standard',   confusableWith: ['l1','l10'], mnemonic: 'Ayin looks like an eye — it means Eye (Ayin means eye).' },
  { id: 'l22', target: 'פּ', name: 'Pe',         transliteration: 'P',      category: 'Letters', visualType: 'standard',   confusableWith: ['l23','l12'],mnemonic: 'Pe looks like a mouth (Peh means mouth) with a tooth inside.' },
  { id: 'l23', target: 'פ',  name: 'Fe',         transliteration: 'F',      category: 'Letters', visualType: 'standard',   confusableWith: ['l22','l24'],mnemonic: 'Fe is Pe without the dot — the tooth is gone, air flows out.' },
  { id: 'l24', target: 'ף',  name: 'Fe Sofit',   transliteration: 'F',      category: 'Letters', visualType: 'descender',  confusableWith: ['l23'],      mnemonic: 'Fe Sofit has a long descending tail at the end of a word.', isFinal: true, rootLetter: 'פ' },
  { id: 'l25', target: 'צ',  name: 'Tsadi',      transliteration: 'Ts',     category: 'Letters', visualType: 'standard',   confusableWith: ['l26'],      mnemonic: 'Tsadi looks like a person bowing with arms raised in righteousness.' },
  { id: 'l26', target: 'ץ',  name: 'Tsadi Sofit',transliteration: 'Ts',     category: 'Letters', visualType: 'descender',  confusableWith: ['l25','l24'],mnemonic: 'Tsadi Sofit stretches its tail downward like a righteous reaching for heaven.', isFinal: true, rootLetter: 'צ' },
  { id: 'l27', target: 'ק',  name: 'Qof',        transliteration: 'K',      category: 'Letters', visualType: 'descender',  confusableWith: ['l9','l6'],  mnemonic: 'Qof has a leg that drops below the line — a Monkey (Qof means monkey) hanging.' },
  { id: 'l28', target: 'ר',  name: 'Resh',       transliteration: 'R',      category: 'Letters', visualType: 'standard',   confusableWith: ['l5','l4'],  mnemonic: 'Resh looks like a bent head — it means Head (Rosh means head).' },
  { id: 'l29', target: 'שׁ', name: 'Shin',       transliteration: 'Sh',     category: 'Letters', visualType: 'standard',   confusableWith: ['l30'],      mnemonic: 'Shin looks like three flames — Fire (Shin resembles teeth/fire).' },
  { id: 'l30', target: 'שׂ', name: 'Sin',        transliteration: 'S',      category: 'Letters', visualType: 'standard',   confusableWith: ['l29'],      mnemonic: 'Sin looks like Shin but the dot is on the left — a mirrored flame.' },
  { id: 'l31', target: 'ת',  name: 'Tav',        transliteration: 'T',      category: 'Letters', visualType: 'standard',   confusableWith: ['l9','l6'],  mnemonic: 'Tav is the last letter — a signature mark (Tav means mark/sign).' },
];

// ◌ = placeholder for the letter
const VOWELS = [
  { id: 'v1', target: '◌ַ', name: 'Patah',      transliteration: 'Ah',  category: 'Vowels', visualType: 'standard', confusableWith: ['v2'],        mnemonic: 'Patah is a short flat line — open your mouth wide: Ah!' },
  { id: 'v2', target: '◌ָ', name: 'Qamatz',     transliteration: 'Ah',  category: 'Vowels', visualType: 'standard', confusableWith: ['v1'],        mnemonic: 'Qamatz looks like a T-shape under a letter — longer Ah sound.' },
  { id: 'v3', target: '◌ֵ', name: 'Tzere',      transliteration: 'Ey',  category: 'Vowels', visualType: 'standard', confusableWith: ['v4'],        mnemonic: 'Tzere is two dots side by side — think "Hey" (Ey sound).' },
  { id: 'v4', target: '◌ֶ', name: 'Segol',      transliteration: 'Eh',  category: 'Vowels', visualType: 'standard', confusableWith: ['v3'],        mnemonic: 'Segol is three dots in a triangle — three legs on a chair (Eh).' },
  { id: 'v5', target: '◌ִ', name: 'Hiriq',      transliteration: 'Ee',  category: 'Vowels', visualType: 'standard', confusableWith: ['v7'],        mnemonic: 'Hiriq is one tiny dot — a single bee: Ee!' },
  { id: 'v6', target: '◌ֹ', name: 'Holam',      transliteration: 'Oh',  category: 'Vowels', visualType: 'ascender', confusableWith: ['v9'],        mnemonic: 'Holam floats above the letter like a full moon — Oh!' },
  { id: 'v7', target: '◌ֻ', name: 'Kubutz',     transliteration: 'Oo',  category: 'Vowels', visualType: 'standard', confusableWith: ['v8'],        mnemonic: 'Kubutz is three diagonal dots — a cluster (Kubutz = kibbutz!) of Oo sounds.' },
  { id: 'v8', target: 'וּ', name: 'Shuruk',     transliteration: 'Oo',  category: 'Vowels', visualType: 'standard', confusableWith: ['v7'],        mnemonic: 'Shuruk is a Vav with a dot in the middle — a straw for Oo.' },
  { id: 'v9', target: 'וֹ', name: 'Holam Male', transliteration: 'Oh',  category: 'Vowels', visualType: 'standard', confusableWith: ['v6'],        mnemonic: 'Holam Male uses Vav as its support — Oh carried on a pillar.' },
  { id: 'v10',target: '◌ְ', name: 'Shva',       transliteration: 'Eh/Silent', category: 'Vowels', visualType: 'standard', confusableWith: ['v4'], mnemonic: 'Shva is two vertical dots — a quick half-breath or silence.' },
  { id: 'v11',target: '◌ֲ', name: 'Hataf Patah',transliteration: 'Ah', category: 'Vowels', visualType: 'standard', confusableWith: ['v1'],         mnemonic: 'Hataf Patah is a rushed Patah — quick Ah under gutturals.' },
  { id: 'v12',target: '◌ֱ', name: 'Hataf Segol',transliteration: 'Eh', category: 'Vowels', visualType: 'standard', confusableWith: ['v4'],         mnemonic: 'Hataf Segol is a rushed Segol — quick Eh under gutturals.' },
];

// ============================================================
// PHONICS PRACTICE — Representative sample of each tier
// Full arrays would have 100 entries each in production
// ============================================================

const PHONICS_1 = [
  // Single Letter + Vowel combos covering all letters and all vowels
  { id: 'p1-01', target: 'מָ', trans: 'Mah',  breakdown: 'מ Mem (M) + ָ Qamatz (Ah)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-02', target: 'לֶ', trans: 'Leh',  breakdown: 'ל Lamed (L) + ֶ Segol (Eh)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-03', target: 'בִּ', trans: 'Bee',  breakdown: 'בּ Bet (B) + ִ Hiriq (Ee)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-04', target: 'סַ', trans: 'Sah',  breakdown: 'ס Samekh (S) + ַ Patah (Ah)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-05', target: 'רֵ', trans: 'Rey',  breakdown: 'ר Resh (R) + ֵ Tzere (Ey)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-06', target: 'תּוֹ', trans: 'Toh', breakdown: 'תּ Tav (T) + וֹ Holam Male (Oh)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-07', target: 'גֻּ', trans: 'Goo',  breakdown: 'גּ Gimel (G) + ֻ Kubutz (Oo)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-08', target: 'דָּ', trans: 'Dah',  breakdown: 'דּ Dalet (D) + ָ Qamatz (Ah)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-09', target: 'שִׁ', trans: 'Shee', breakdown: 'שׁ Shin (Sh) + ִ Hiriq (Ee)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-10', target: 'זֶ', trans: 'Zeh',  breakdown: 'ז Zayin (Z) + ֶ Segol (Eh)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-11', target: 'הוּ', trans: 'Hoo',  breakdown: 'ה He (H) + וּ Shuruk (Oo)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-12', target: 'כָּ', trans: 'Kah',  breakdown: 'כּ Kaf (K) + ָ Qamatz (Ah)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-13', target: 'פֶּ', trans: 'Peh',  breakdown: 'פּ Pe (P) + ֶ Segol (Eh)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-14', target: 'נִ', trans: 'Nee',  breakdown: 'נ Nun (N) + ִ Hiriq (Ee)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-15', target: 'חַ', trans: 'Chah', breakdown: 'ח Chet (Ch) + ַ Patah (Ah)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-16', target: 'טֵ', trans: 'Tey',  breakdown: 'ט Tet (T) + ֵ Tzere (Ey)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-17', target: 'יָ', trans: 'Yah',  breakdown: 'י Yod (Y) + ָ Qamatz (Ah)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-18', target: 'עֶ', trans: 'Eh',   breakdown: 'ע Ayin (Silent) + ֶ Segol (Eh)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  { id: 'p1-19', target: 'קִ', trans: 'Kee',  breakdown: 'ק Qof (K) + ִ Hiriq (Ee)', category: 'Phonics: 1 Letter', visualType: 'descender' },
  { id: 'p1-20', target: 'בַ', trans: 'Vah',  breakdown: 'ב Vet (V) + ַ Patah (Ah)', category: 'Phonics: 1 Letter', visualType: 'standard' },
  // ... (80 more entries in production, cycling all letter/vowel combinations)
];

const PHONICS_2 = [
  // Two-letter words
  { id: 'p2-01', target: 'בַּת',  trans: 'Bat',   breakdown: 'בּ Bet(B) + ַ Patah + ת Tav(T)',     category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-02', target: 'גַּם',  trans: 'Gam',   breakdown: 'גּ Gimel(G) + ַ Patah + ם Mem(M)',    category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-03', target: 'יָד',  trans: 'Yad',   breakdown: 'י Yod(Y) + ָ Qamatz + ד Dalet(D)',   category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-04', target: 'דָּג',  trans: 'Dag',   breakdown: 'דּ Dalet(D) + ָ Qamatz + ג Gimel(G)', category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-05', target: 'סִים', trans: 'Seem',  breakdown: 'ס Samekh(S) + ִ Hiriq + ם Mem(M)',    category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-06', target: 'מֵן',  trans: 'Men',   breakdown: 'מ Mem(M) + ֵ Tzere + ן Nun(N)',       category: 'Phonics: 2 Letters', visualType: 'descender' },
  { id: 'p2-07', target: 'לֵב',  trans: 'Lev',   breakdown: 'ל Lamed(L) + ֵ Segol + ב Vet(V)',     category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-08', target: 'שָׁר',  trans: 'Shar',  breakdown: 'שׁ Shin(Sh) + ָ Qamatz + ר Resh(R)', category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-09', target: 'חַי',  trans: 'Chai',  breakdown: 'ח Chet(Ch) + ַ Patah + י Yod(Y)',    category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-10', target: 'קַל',  trans: 'Kal',   breakdown: 'ק Qof(K) + ַ Patah + ל Lamed(L)',    category: 'Phonics: 2 Letters', visualType: 'descender' },
  { id: 'p2-11', target: 'עוֹף',  trans: 'Of',    breakdown: 'ע Ayin(Silent) + וֹ Holam + ף Fe(F)', category: 'Phonics: 2 Letters', visualType: 'descender' },
  { id: 'p2-12', target: 'פֶּן',  trans: 'Pen',   breakdown: 'פּ Pe(P) + ֶ Segol + ן Nun(N)',       category: 'Phonics: 2 Letters', visualType: 'descender' },
  { id: 'p2-13', target: 'רַע',  trans: 'Ra',    breakdown: 'ר Resh(R) + ַ Patah + ע Ayin(Silent)', category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-14', target: 'תֵּן',  trans: 'Ten',   breakdown: 'תּ Tav(T) + ֵ Tzere + ן Nun(N)',      category: 'Phonics: 2 Letters', visualType: 'descender' },
  { id: 'p2-15', target: 'בּוֹא',  trans: 'Bo',    breakdown: 'בּ Bet(B) + וֹ Holam Male + א Aleph', category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-16', target: 'שִׁיר',  trans: 'Sheer', breakdown: 'שׁ Shin(Sh) + ִ Hiriq + ר Resh(R)',  category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-17', target: 'זֶה',  trans: 'Zeh',   breakdown: 'ז Zayin(Z) + ֶ Segol + ה He(H)',      category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-18', target: 'גָּד',  trans: 'Gad',   breakdown: 'גּ Gimel(G) + ָ Qamatz + ד Dalet(D)', category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-19', target: 'כּוֹל',  trans: 'Kol',   breakdown: 'כּ Kaf(K) + וֹ Holam Male + ל Lamed(L)', category: 'Phonics: 2 Letters', visualType: 'standard' },
  { id: 'p2-20', target: 'מִי',  trans: 'Mee',   breakdown: 'מ Mem(M) + ִ Hiriq + י Yod(Silent)', category: 'Phonics: 2 Letters', visualType: 'standard' },
  // ... (80 more in production)
];

const PHONICS_3 = [
  // Three-letter words
  { id: 'p3-01', target: 'שָׁלוֹם',  trans: 'Shalom',  breakdown: 'שׁ Sh + ָ A + ל L + וֹ O + ם M',      category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-02', target: 'סֵפֶר',   trans: 'Sefer',   breakdown: 'ס S + ֵ Ey + פ F + ֶ Eh + ר R',        category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-03', target: 'מֶלֶךְ',   trans: 'Melekh',  breakdown: 'מ M + ֶ Eh + ל L + ֶ Eh + ך Kh',        category: 'Phonics: 3 Letters', visualType: 'descender' },
  { id: 'p3-04', target: 'גָּמָל',   trans: 'Gamal',   breakdown: 'גּ G + ָ A + מ M + ָ A + ל L',           category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-05', target: 'כּוֹכָב',   trans: 'Kokhav',  breakdown: 'כּ K + וֹ O + כ Kh + ָ A + ב V',         category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-06', target: 'בָּרַק',   trans: 'Barak',   breakdown: 'בּ B + ָ A + ר R + ַ A + ק K',           category: 'Phonics: 3 Letters', visualType: 'descender' },
  { id: 'p3-07', target: 'דָּבָר',   trans: 'Davar',   breakdown: 'דּ D + ָ A + ב V + ָ A + ר R',           category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-08', target: 'יֶלֶד',   trans: 'Yeled',   breakdown: 'י Y + ֶ E + ל L + ֶ E + ד D',            category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-09', target: 'זְמַן',   trans: 'Zman',    breakdown: 'ז Z + ְ Shva + מ M + ַ A + ן N',         category: 'Phonics: 3 Letters', visualType: 'descender' },
  { id: 'p3-10', target: 'חָתוּל',   trans: 'Chatul',  breakdown: 'ח Ch + ָ A + ת T + וּ Oo + ל L',         category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-11', target: 'תַּנּוּר',  trans: 'Tanur',   breakdown: 'תּ T + ַ A + נ N + וּ Oo + ר R',          category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-12', target: 'בֹּקֶר',   trans: 'Boker',   breakdown: 'בּ B + ֹ O + ק K + ֶ E + ר R',           category: 'Phonics: 3 Letters', visualType: 'descender' },
  { id: 'p3-13', target: 'פֶּרַח',   trans: 'Perach',  breakdown: 'פּ P + ֶ E + ר R + ַ A + ח Ch',          category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-14', target: 'עוֹלָם',   trans: 'Olam',    breakdown: 'ע O + וֹ Holam + ל L + ָ A + ם M',       category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-15', target: 'מַיִם',   trans: 'Mayim',   breakdown: 'מ M + ַ A + י Y + ִ Ee + ם M',           category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-16', target: 'שֶׁמֶשׁ',   trans: 'Shemesh', breakdown: 'שׁ Sh + ֶ E + מ M + ֶ E + שׁ Sh',         category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-17', target: 'לֶחֶם',   trans: 'Lechem',  breakdown: 'ל L + ֶ E + ח Ch + ֶ E + ם M',           category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-18', target: 'מָקוֹם',   trans: 'Makom',   breakdown: 'מ M + ָ A + ק K + וֹ O + ם M',           category: 'Phonics: 3 Letters', visualType: 'descender' },
  { id: 'p3-19', target: 'כִּסֵּא',   trans: 'Kisey',   breakdown: 'כּ K + ִ Ee + ס S + ֵּ Ey + א Aleph',    category: 'Phonics: 3 Letters', visualType: 'standard' },
  { id: 'p3-20', target: 'מִדְבָּר',  trans: 'Midbar',  breakdown: 'מ M + ִ Ee + דּ D + ְ Shva + בּ B + ָ A + ר R', category: 'Phonics: 3 Letters', visualType: 'standard' },
  // ... (80 more in production)
];

// ============================================================
// VOCABULARY — 100 words across 3 categories (representative 20 shown)
// ============================================================
const VOCABULARY = [
  // HOLIDAYS (חַגִּים)
  { id: 'voc-h01', target: 'מַצָּה',    trans: 'Matzah',     meaning: 'Unleavened bread (Passover)', category: 'Vocabulary: Holidays', subcategory: 'holidays', visualType: 'standard' },
  { id: 'voc-h02', target: 'חֲנֻכִּיָּה', trans: 'Chanukiyah', meaning: 'Hanukkah menorah (8 branches)', category: 'Vocabulary: Holidays', subcategory: 'holidays', visualType: 'standard' },
  { id: 'voc-h03', target: 'שׁוֹפָר',   trans: 'Shofar',     meaning: 'Ram\'s horn (Rosh Hashanah)', category: 'Vocabulary: Holidays', subcategory: 'holidays', visualType: 'standard' },
  { id: 'voc-h04', target: 'סֻכָּה',    trans: 'Sukkah',     meaning: 'Hut for Sukkot festival', category: 'Vocabulary: Holidays', subcategory: 'holidays', visualType: 'standard' },
  { id: 'voc-h05', target: 'אֶסְתֵּר',  trans: 'Esther',     meaning: 'Queen Esther (Purim)', category: 'Vocabulary: Holidays', subcategory: 'holidays', visualType: 'standard' },
  { id: 'voc-h06', target: 'מְגִלָּה',  trans: 'Megillah',   meaning: 'Scroll (read on Purim)', category: 'Vocabulary: Holidays', subcategory: 'holidays', visualType: 'standard' },
  { id: 'voc-h07', target: 'אֲפִיקוֹמָן', trans: 'Afikoman',  meaning: 'Hidden matzah (Passover seder)', category: 'Vocabulary: Holidays', subcategory: 'holidays', visualType: 'standard' },
  // BLESSINGS (בְּרָכוֹת)
  { id: 'voc-b01', target: 'בָּרוּךְ',  trans: 'Baruch',     meaning: 'Blessed (beginning of blessings)', category: 'Vocabulary: Blessings', subcategory: 'blessings', visualType: 'descender' },
  { id: 'voc-b02', target: 'עוֹלָם',    trans: 'Olam',       meaning: 'World/Universe (in blessings)', category: 'Vocabulary: Blessings', subcategory: 'blessings', visualType: 'standard' },
  { id: 'voc-b03', target: 'לֶחֶם',    trans: 'Lechem',     meaning: 'Bread (HaMotzi blessing)', category: 'Vocabulary: Blessings', subcategory: 'blessings', visualType: 'standard' },
  { id: 'voc-b04', target: 'מִצְווֹת',  trans: 'Mitzvot',    meaning: 'Commandments (blessing formula)', category: 'Vocabulary: Blessings', subcategory: 'blessings', visualType: 'standard' },
  { id: 'voc-b05', target: 'אֱלֹהֵינוּ',trans: 'Eloheinu',   meaning: 'Our God (in blessings)', category: 'Vocabulary: Blessings', subcategory: 'blessings', visualType: 'standard' },
  { id: 'voc-b06', target: 'שַׁבָּת',   trans: 'Shabbat',    meaning: 'Sabbath (Friday night blessing)', category: 'Vocabulary: Blessings', subcategory: 'blessings', visualType: 'standard' },
  { id: 'voc-b07', target: 'יַיִן',    trans: 'Yayin',      meaning: 'Wine (Kiddush blessing)', category: 'Vocabulary: Blessings', subcategory: 'blessings', visualType: 'standard' },
  // MODERN HEBREW (עִבְרִית מוֹדֶרְנִית)
  { id: 'voc-m01', target: 'גְּלִידָה', trans: 'Glida',      meaning: 'Ice cream', category: 'Vocabulary: Modern Hebrew', subcategory: 'modern', visualType: 'standard' },
  { id: 'voc-m02', target: 'סַבָּבָה',  trans: 'Sababa',     meaning: 'Cool / Awesome (slang)', category: 'Vocabulary: Modern Hebrew', subcategory: 'modern', visualType: 'standard' },
  { id: 'voc-m03', target: 'מַחְשֵׁב',  trans: 'Machshev',   meaning: 'Computer', category: 'Vocabulary: Modern Hebrew', subcategory: 'modern', visualType: 'standard' },
  { id: 'voc-m04', target: 'אוֹטוֹבּוּס', trans: 'Otobus',    meaning: 'Bus', category: 'Vocabulary: Modern Hebrew', subcategory: 'modern', visualType: 'standard' },
  { id: 'voc-m05', target: 'טֶלֶפוֹן',  trans: 'Telefon',    meaning: 'Telephone', category: 'Vocabulary: Modern Hebrew', subcategory: 'modern', visualType: 'standard' },
  { id: 'voc-m06', target: 'תּוֹדָה',   trans: 'Todah',      meaning: 'Thank you', category: 'Vocabulary: Modern Hebrew', subcategory: 'modern', visualType: 'standard' },
  // ... (80 more in production, 30 holidays / 30 blessings / 40 modern Hebrew)
];

// ============================================================
// LEARNING PATH SEQUENCE
// ============================================================
const LEARNING_PATH = [
  { id: 'path-vowels',   label: 'Vowels',              categories: ['Vowels'],                                             icon: '◌' },
  { id: 'path-letters',  label: 'Basic Letters',        categories: ['Letters'],                                            icon: 'א' },
  { id: 'path-phonics1', label: 'Phonics: 1 Letter',    categories: ['Phonics: 1 Letter'],                                  icon: 'בָ' },
  { id: 'path-phonics2', label: 'Phonics: 2 Letters',   categories: ['Phonics: 2 Letters'],                                 icon: 'שַׁר' },
  { id: 'path-phonics3', label: 'Phonics: 3 Letters',   categories: ['Phonics: 3 Letters'],                                 icon: 'שָׁלוֹם' },
  { id: 'path-vocab',    label: 'Vocabulary',           categories: ['Vocabulary: Holidays','Vocabulary: Blessings','Vocabulary: Modern Hebrew'], icon: '📖' },
];

const ALL_CATEGORIES = [
  'Letters', 'Vowels',
  'Phonics: 1 Letter', 'Phonics: 2 Letters', 'Phonics: 3 Letters',
  'Vocabulary: Holidays', 'Vocabulary: Blessings', 'Vocabulary: Modern Hebrew',
];

// Build flat card pool with mastery scores
const buildCardPool = () => {
  const cards = [
    ...LETTERS,
    ...VOWELS,
    ...PHONICS_1,
    ...PHONICS_2,
    ...PHONICS_3,
    ...VOCABULARY,
  ];
  return cards.map(c => ({ ...c, masteryScore: 3 })); // 0-6 scale, start at 3
};

const ALL_CARDS = buildCardPool();

// ============================================================
// TRANSLATIONS
// ============================================================
const TRANSLATIONS = {
  en: {
    title: 'HEBREW LEARNING',
    start: 'Begin Session',
    correct: 'Correct!',
    points: 'Points',
    skip: 'Next',
    settings: 'Settings',
    reveal: 'Tap to reveal',
    addStudent: 'Add learner',
    vocabulary: 'Vocabulary',
    phonics: 'Phonics',
    letters: 'Letters & Vowels',
    mastery: 'Mastery',
    learningPath: 'Learning Path',
    mnemonic: 'Memory tip',
    showRoot: 'Show Root Form',
  },
  he: {
    title: 'לִמּוּד עִבְרִית',
    start: 'הַתְחֵל',
    correct: 'נָכוֹן!',
    points: 'נְקוּדוֹת',
    skip: 'הַבָּא',
    settings: 'הַגְדָּרוֹת',
    reveal: 'הַפֵּךְ לְתְשׁוּבָה',
    addStudent: 'הוֹסֵף שֵׁם',
    vocabulary: 'אוֹצַר מִלִּים',
    phonics: 'פוֹנֶטִיקָה',
    letters: 'אוֹתִיּוֹת וְנִקּוּד',
    mastery: 'שְׁלִיטָה',
    learningPath: 'מַסְלוּל לִמּוּד',
    mnemonic: 'טִיפּ לַזִּכָּרוֹן',
    showRoot: 'הַצֵּג צוּרַת שֹׁרֶשׁ',
  },
};

// ============================================================
// UTILITY: Dynamic font sizing
// ============================================================
const getHebrewFontSize = (text) => {
  const len = (text || '').replace(/[\u05B0-\u05C7\u05F0-\u05F4]/g, '').length; // strip niqqud
  if (len <= 1)  return 'text-[90px] sm:text-[110px]';
  if (len <= 2)  return 'text-[72px] sm:text-[90px]';
  if (len <= 3)  return 'text-[58px] sm:text-[72px]';
  if (len <= 5)  return 'text-[44px] sm:text-[58px]';
  return               'text-[32px] sm:text-[42px]';
};

// ============================================================
// MASTERY BADGE
// ============================================================
const MasteryDots = ({ score }) => {
  const max = 6;
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i < score ? 'bg-emerald-400 shadow-sm shadow-emerald-300' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
};

// ============================================================
// WRITING GRID CARD FRONT
// ============================================================
const WritingGridCard = ({ card, isDescender, showRoot, onToggleRoot }) => {
  const fontClass = getHebrewFontSize(card.target);

  return (
    <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl ring-1 ring-slate-200 overflow-hidden writing-grid">
      {/* Primary Paper Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Descender line (dashed, lower 30%) */}
        <div className="absolute left-0 right-0 border-t-2 border-dashed border-blue-200" style={{ top: '72%' }} />
        {/* Baseline (solid, bold) */}
        <div className="absolute left-0 right-0 border-t-2 border-slate-400" style={{ top: '62%' }} />
        {/* Mid line */}
        <div className="absolute left-0 right-0 border-t border-slate-100" style={{ top: '42%' }} />
        {/* Top line */}
        <div className="absolute left-0 right-0 border-t border-slate-100" style={{ top: '22%' }} />
      </div>

      {/* Category badge */}
      <div className="absolute top-5 left-0 right-0 flex justify-between items-center px-6">
        <span className="text-[9px] font-black tracking-widest text-slate-300 uppercase">
          {card.category?.split(':').pop()?.trim()}
        </span>
        {card.isFinal && (
          <button
            onClick={e => { e.stopPropagation(); onToggleRoot(); }}
            className="flex items-center gap-1 text-[9px] font-black text-slate-400 hover:text-indigo-500 transition-colors bg-slate-50 px-2 py-1 rounded-full border border-slate-200"
          >
            {showRoot ? <EyeOff size={10} /> : <Eye size={10} />}
            Root
          </button>
        )}
      </div>

      {/* Letter Display */}
      <div className={`relative flex items-end justify-center w-full ${isDescender ? 'pb-8' : ''}`}
           style={{ marginTop: isDescender ? '0' : '0', height: '200px' }}>
        {/* Root form overlay for final letters */}
        {card.isFinal && showRoot && card.rootLetter && (
          <span
            className={`absolute font-black leading-none font-hebrew text-slate-200 select-none ${fontClass}`}
            style={{ bottom: isDescender ? '2rem' : '0', right: '50%', transform: 'translateX(50%)' }}
          >
            {card.rootLetter}
          </span>
        )}
        <span
          className={`font-black leading-none font-hebrew text-slate-900 relative z-10 ${fontClass} ${
            isDescender ? 'translate-y-8' : ''
          } transition-transform duration-300`}
        >
          {card.target}
        </span>
      </div>

      {/* Mastery + flip hint */}
      <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2">
        <MasteryDots score={card.masteryScore || 3} />
        <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5 tracking-wide animate-pulse">
          <RotateCcw size={10} /> Tap to reveal
        </span>
      </div>
    </div>
  );
};

// ============================================================
// CARD BACK
// ============================================================
const CardBack = ({ card, teamColor, isSpeaking, onSpeak }) => (
  <div className={`absolute inset-0 backface-hidden rotate-y-180 ${teamColor} rounded-[2.5rem] flex flex-col items-center justify-center text-white p-5 shadow-2xl border-8 border-white/20`}>
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      {/* Audio button */}
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); onSpeak(e); }}
        className={`p-3 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 shadow-inner transition-all flex items-center justify-center ring-1 ring-white/30 ${isSpeaking ? 'ring-4 ring-white animate-pulse' : ''}`}
      >
        <Volume2 size={22} className="text-white" />
      </button>

      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Sound</p>
        <h2 className="text-3xl font-black tracking-tight drop-shadow-md">{card.transliteration || card.trans}</h2>
      </div>

      <div className="bg-black/20 w-full p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">
          {card.name ? 'Name' : 'Word'}
        </p>
        <p className="text-white font-bold text-sm leading-tight">
          {card.name || card.meaning || card.breakdown}
        </p>
      </div>

      {/* Mnemonic */}
      {card.mnemonic && (
        <div className="bg-white/10 w-full p-3 rounded-2xl border border-white/10">
          <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Brain size={9} /> Memory Tip
          </p>
          <p className="text-white/90 text-xs italic leading-tight">{card.mnemonic}</p>
        </div>
      )}

      {/* Breakdown for phonics */}
      {card.breakdown && !card.name && (
        <div className="bg-black/20 w-full p-2 rounded-xl border border-white/10">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Breakdown</p>
          <p className="text-white/80 text-[11px] leading-tight font-mono">{card.breakdown}</p>
        </div>
      )}
    </div>
  </div>
);

// ============================================================
// MAIN APP
// ============================================================
const App = () => {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('lobby');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRoot, setShowRoot] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeCategories, setActiveCategories] = useState(['Letters', 'Vowels']);
  const [pathLocked, setPathLocked] = useState(false);
  const [unlockedPathIdx, setUnlockedPathIdx] = useState(0);
  const [cardPool, setCardPool] = useState(ALL_CARDS);
  const [sessionDeck, setSessionDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settingsTab, setSettingsTab] = useState('categories'); // 'categories' | 'path'
  const [newLearnerName, setNewLearnerName] = useState({ 1: '', 2: '' });
  const [teams, setTeams] = useState([
    { id: 1, name: 'Team Blue', members: ['Alex'],  score: 0, currentMemberIdx: 0, color: 'bg-indigo-600', light: 'bg-indigo-50',  border: 'border-indigo-200' },
    { id: 2, name: 'Team Gold', members: ['Sam'],   score: 0, currentMemberIdx: 0, color: 'bg-amber-500',  light: 'bg-amber-50',   border: 'border-amber-200'  },
  ]);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);

  const t = TRANSLATIONS[lang];
  const currentTeam = teams[activeTeamIdx];
  const currentStudent = currentTeam?.members[currentTeam?.currentMemberIdx] || currentTeam?.name;
  const currentCard = sessionDeck[currentIndex];

  // ── SRS / Mastery helpers ──────────────────────────────────
  const updateMastery = useCallback((cardId, correct) => {
    setCardPool(prev => prev.map(c => {
      if (c.id !== cardId) return c;
      const delta = correct ? 1 : -1;
      return { ...c, masteryScore: Math.max(0, Math.min(6, c.masteryScore + delta)) };
    }));
  }, []);

  // Build SRS-weighted deck: lower mastery → more likely to appear
  const prepareDeck = useCallback((cats = activeCategories) => {
    const filtered = cardPool.filter(c => cats.includes(c.category));
    // Weight: cards with score 0-2 appear 3x, 3-4 appear 2x, 5-6 appear 1x
    const weighted = filtered.flatMap(c => {
      const w = c.masteryScore <= 2 ? 3 : c.masteryScore <= 4 ? 2 : 1;
      return Array(w).fill(c);
    });
    const shuffled = weighted.sort(() => Math.random() - 0.5);
    setSessionDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowRoot(false);
  }, [activeCategories, cardPool]);

  const startSession = () => { prepareDeck(); setView('studying'); };

  // ── Audio ──────────────────────────────────────────────────
  const speakAnswer = useCallback((e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!window.speechSynthesis || isSpeaking || !currentCard) return;
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const heVoice = voices.find(v => v.lang.startsWith('he'));
    const speakText = currentCard.category === 'Letters' ? currentCard.name : (currentCard.target || '').replace(/◌/g, '');
    const utt = new SpeechSynthesisUtterance(speakText);
    utt.lang = currentCard.category === 'Letters' ? 'en-US' : 'he-IL';
    if (currentCard.category !== 'Letters' && heVoice) utt.voice = heVoice;
    utt.rate = 0.8;
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [currentCard, isSpeaking]);

  // ── Turn management ────────────────────────────────────────
  const nextTurn = (correct) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (currentCard) updateMastery(currentCard.id, correct);

    if (correct) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 900);
      setTeams(prev => prev.map((tm, i) => {
        if (i !== activeTeamIdx) return tm;
        return { ...tm, score: tm.score + 1 };
      }));
    }
    setActiveTeamIdx(prev => (prev + 1) % teams.length);
    setTeams(prev => prev.map((tm, i) => {
      if (i !== activeTeamIdx) return tm;
      return { ...tm, currentMemberIdx: (tm.currentMemberIdx + 1) % tm.members.length };
    }));

    const next = currentIndex + 1;
    if (next >= sessionDeck.length) {
      prepareDeck();
    } else {
      setCurrentIndex(next);
      setIsFlipped(false);
      setShowRoot(false);
    }
  };

  const adjustScore = (idx, delta, e) => {
    e.stopPropagation();
    setTeams(prev => prev.map((tm, i) => i === idx ? { ...tm, score: Math.max(0, tm.score + delta) } : tm));
  };

  const addLearner = (teamId) => {
    const name = newLearnerName[teamId]?.trim();
    if (!name) return;
    setTeams(prev => prev.map(tm => tm.id === teamId ? { ...tm, members: [...tm.members, name] } : tm));
    setNewLearnerName(prev => ({ ...prev, [teamId]: '' }));
  };

  const switchMode = (cat) => {
    const cats = [cat];
    setActiveCategories(cats);
    prepareDeck(cats);
  };

  // Category group shortcuts for lobby
  const categoryGroups = [
    { label: t.letters,    cats: ['Letters', 'Vowels'], icon: 'א' },
    { label: t.phonics,    cats: ['Phonics: 1 Letter', 'Phonics: 2 Letters', 'Phonics: 3 Letters'], icon: 'בָ' },
    { label: t.vocabulary, cats: ['Vocabulary: Holidays', 'Vocabulary: Blessings', 'Vocabulary: Modern Hebrew'], icon: '📖' },
  ];

  const totalMastery = Math.round(
    cardPool.filter(c => activeCategories.includes(c.category)).reduce((s, c) => s + (c.masteryScore || 0), 0) /
    Math.max(1, cardPool.filter(c => activeCategories.includes(c.category)).length)
  );

  const isDescender = currentCard?.visualType === 'descender';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50 flex items-center justify-center p-2 font-sans">
      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-[85vh] max-h-[95vh] relative">

        {/* ── Global Nav ── */}
        <div className="bg-slate-900 px-4 py-3 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            {view !== 'lobby' && (
              <button onClick={() => setView('lobby')} className="p-1 hover:bg-white/10 rounded-lg transition-colors mr-1">
                <ArrowLeft size={15} />
              </button>
            )}
            <BookOpen size={15} className="text-indigo-400" />
            <h1 className="text-[10px] font-black tracking-widest uppercase">{t.title}</h1>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setLang(l => l === 'en' ? 'he' : 'en')} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <Globe size={15} />
            </button>
            <button onClick={() => setView('settings')} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <Settings size={15} />
            </button>
          </div>
        </div>

        {/* ── Scoreboard ── */}
        {view === 'studying' && (
          <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 shrink-0">
            {teams.map((team, idx) => (
              <div key={team.id} className={`p-2.5 flex flex-col items-center transition-all ${activeTeamIdx === idx ? 'bg-white shadow-sm ring-1 ring-black/5 z-10' : 'opacity-40'}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-2 h-2 rounded-full ${team.color} ${activeTeamIdx === idx ? 'animate-pulse' : ''}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{team.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={e => adjustScore(idx, -1, e)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500 transition-colors">
                    <Minus size={13} strokeWidth={3} />
                  </button>
                  <span className={`text-2xl font-black tabular-nums ${activeTeamIdx === idx ? 'text-slate-900' : 'text-slate-400'}`}>{team.score}</span>
                  <button onClick={e => adjustScore(idx, 1, e)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-emerald-500 transition-colors">
                    <Plus size={13} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Main Content Area ── */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col overflow-hidden relative">

          {/* Celebration */}
          {showCelebration && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute w-2 h-4 rounded-full animate-bounce" style={{
                  backgroundColor: ['#6366f1','#10b981','#fbbf24','#f87171','#a78bfa'][i % 5],
                  left: `${10 + (i * 7.5)}%`,
                  top: `${20 + (i % 3) * 20}%`,
                  animationDelay: `${i * 60}ms`,
                  opacity: 0.7,
                }} />
              ))}
            </div>
          )}

          {/* ════════════════════════════════════
               LOBBY VIEW
          ════════════════════════════════════ */}
          {view === 'lobby' && (
            <div className="flex flex-col h-full">
              {/* Mastery indicator */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 mb-3 border border-indigo-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Star size={18} className="text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-wider">{t.mastery}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 bg-indigo-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${(totalMastery/6)*100}%` }} />
                    </div>
                    <span className="text-xs font-black text-indigo-600">{totalMastery}/6</span>
                  </div>
                </div>
              </div>

              {/* Quick-select category groups */}
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Select Focus</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {categoryGroups.map(g => {
                  const active = g.cats.every(c => activeCategories.includes(c));
                  return (
                    <button
                      key={g.label}
                      onClick={() => setActiveCategories(active ? activeCategories.filter(c => !g.cats.includes(c)) : [...new Set([...activeCategories, ...g.cats])])}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all text-center gap-1 ${active ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                    >
                      <span className="text-xl font-hebrew">{g.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-tight leading-tight">{g.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Team setup */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                {teams.map(team => (
                  <div key={team.id} className={`${team.light} p-3 rounded-2xl border-2 ${team.border}`}>
                    <h3 className="font-black text-slate-800 text-sm mb-2">{team.name}</h3>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder={t.addStudent}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={newLearnerName[team.id]}
                        onChange={e => setNewLearnerName(p => ({ ...p, [team.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && addLearner(team.id)}
                      />
                      <button onClick={() => addLearner(team.id)} className={`${team.color} text-white p-2 rounded-lg shadow-sm active:scale-95 transition-all`}>
                        <UserPlus size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {team.members.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs bg-white px-2 py-1 rounded-full shadow-sm border border-slate-100">
                          <span className="font-bold">{m}</span>
                          <button onClick={() => setTeams(prev => prev.map(tm => tm.id === team.id ? { ...tm, members: tm.members.filter((_, i) => i !== idx) } : tm))} className="text-slate-300 hover:text-red-500">
                            <X size={9} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={startSession}
                disabled={activeCategories.length === 0}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all text-base mt-3 flex items-center justify-center gap-2 shrink-0"
              >
                <Play size={18} />
                {t.start}
              </button>
            </div>
          )}

          {/* ════════════════════════════════════
               STUDYING VIEW
          ════════════════════════════════════ */}
          {view === 'studying' && currentCard && (
            <div className="flex flex-col h-full">
              {/* Turn indicator */}
              <div className={`relative p-2.5 rounded-xl border-2 transition-all mb-3 ${currentTeam.light} ${currentTeam.border} text-center shrink-0`}>
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${currentTeam.color} rounded-l-xl`} />
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Current Turn</span>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${currentTeam.color} animate-ping`} />
                  <span className={`text-lg font-black ${currentTeam.id === 1 ? 'text-indigo-900' : 'text-amber-900'} uppercase tracking-tight`}>{currentStudent}</span>
                </div>
              </div>

              {/* Mode quick-switch pills */}
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1 overflow-x-auto no-scrollbar self-center shadow-inner mb-3 shrink-0 w-full">
                {ALL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => switchMode(cat)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[8px] font-black uppercase transition-all shrink-0 ${activeCategories.length === 1 && activeCategories[0] === cat ? 'bg-white text-indigo-600 shadow ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {cat.split(':').pop().trim().substring(0, 6)}
                  </button>
                ))}
              </div>

              {/* Card */}
              <div className="flex-1 flex flex-col items-center justify-center perspective-1000 min-h-0">
                <div
                  onClick={() => !isFlipped && setIsFlipped(true)}
                  className={`relative w-full max-h-[300px] max-w-[280px] transition-all duration-500 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                  style={{ height: '300px' }}
                >
                  <WritingGridCard
                    card={{ ...currentCard, masteryScore: cardPool.find(c => c.id === currentCard.id)?.masteryScore ?? 3 }}
                    isDescender={isDescender}
                    showRoot={showRoot}
                    onToggleRoot={() => setShowRoot(p => !p)}
                  />
                  <CardBack
                    card={currentCard}
                    teamColor={currentTeam.color}
                    isSpeaking={isSpeaking}
                    onSpeak={speakAnswer}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4 shrink-0">
                <button
                  onClick={() => nextTurn(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg flex flex-col items-center transition-all active:scale-95 group"
                >
                  <Check size={26} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase font-black mt-0.5 tracking-wider">{t.correct}</span>
                </button>
                <button
                  onClick={() => nextTurn(false)}
                  className="bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-lg flex flex-col items-center transition-all active:scale-95 group"
                >
                  <ChevronRight size={26} className="group-hover:translate-x-1 transition-transform" />
                  <span className="text-[10px] uppercase font-black mt-0.5 tracking-wider">{t.skip}</span>
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════
               SETTINGS VIEW
          ════════════════════════════════════ */}
          {view === 'settings' && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Settings</h2>
                <button onClick={() => setView('lobby')} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={18} /></button>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1 mb-4 shrink-0">
                {[['categories', 'Categories', <Layers size={12}/>], ['path', 'Learning Path', <GraduationCap size={12}/>]].map(([id, label, icon]) => (
                  <button
                    key={id}
                    onClick={() => setSettingsTab(id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${settingsTab === id ? 'bg-white text-indigo-600 shadow ring-1 ring-slate-200' : 'text-slate-400'}`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              {settingsTab === 'categories' && (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {ALL_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${activeCategories.includes(cat) ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      <span className="font-bold text-sm">{cat}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeCategories.includes(cat) ? 'bg-indigo-500 text-white' : 'bg-slate-100'}`}>
                        {activeCategories.includes(cat) ? <Check size={11} strokeWidth={4} /> : <Plus size={11} />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {settingsTab === 'path' && (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-2">
                    <div>
                      <p className="text-xs font-black text-amber-700">Pedagogical Sequence Lock</p>
                      <p className="text-[10px] text-amber-500 mt-0.5">Unlock stages as learners advance</p>
                    </div>
                    <button onClick={() => setPathLocked(p => !p)} className={`p-2 rounded-xl transition-all ${pathLocked ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-400'}`}>
                      {pathLocked ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                  </div>

                  {LEARNING_PATH.map((step, idx) => {
                    const unlocked = !pathLocked || idx <= unlockedPathIdx;
                    const active = step.categories.every(c => activeCategories.includes(c));
                    return (
                      <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${unlocked ? (active ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-slate-200') : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-hebrew text-lg shrink-0">
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-black ${active ? 'text-indigo-700' : 'text-slate-600'}`}>{idx + 1}. {step.label}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {pathLocked && idx === unlockedPathIdx + 1 && (
                            <button onClick={() => setUnlockedPathIdx(idx)} className="text-[9px] font-black text-amber-500 border border-amber-300 px-2 py-0.5 rounded-full hover:bg-amber-50">
                              Unlock
                            </button>
                          )}
                          <button
                            disabled={!unlocked}
                            onClick={() => unlocked && setActiveCategories(prev => {
                              const all = step.categories.every(c => prev.includes(c));
                              return all ? prev.filter(c => !step.categories.includes(c)) : [...new Set([...prev, ...step.categories])];
                            })}
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${active ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {active ? <Check size={11} strokeWidth={4} /> : <Plus size={11} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button onClick={() => setView('lobby')} className="w-full bg-slate-900 text-white font-black py-3.5 rounded-xl shadow-lg mt-3 shrink-0">
                Save & Return
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── Styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;700;900&display=swap');
        .perspective-1000  { perspective: 1000px; }
        .preserve-3d       { transform-style: preserve-3d; }
        .backface-hidden   { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180      { transform: rotateY(180deg); }
        .font-hebrew       { font-family: 'Noto Sans Hebrew', 'SBL Hebrew', 'David Libre', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar      { -ms-overflow-style: none; scrollbar-width: none; }
        .writing-grid      { background-color: #fff; }
      `}} />
    </div>
  );
};

export default App;
