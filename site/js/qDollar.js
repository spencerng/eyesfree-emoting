/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *  Jacob O. Wobbrock, Ph.D.
 *  The Information School
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  wobbrock@uw.edu
 *
 *  Andrew D. Wilson, Ph.D.
 *  Microsoft Research
 *  One Microsoft Way
 *  Redmond, WA 98052
 *  awilson@microsoft.com
 *
 *  Yang Li, Ph.D.
 *  Department of Computer Science and Engineering
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be
 * used to cite it, is:
 *
 *     Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without
 *     libraries, toolkits or training: A $1 recognizer for user interface
 *     prototypes. Proceedings of the ACM Symposium on User Interface
 *     Software and Technology (UIST '07). Newport, Rhode Island (October
 *     7-10, 2007). New York: ACM Press, pp. 159-168.
 *     https://dl.acm.org/citation.cfm?id=1294238
 *
 * The Protractor enhancement was separately published by Yang Li and programmed
 * here by Jacob O. Wobbrock:
 *
 *     Li, Y. (2010). Protractor: A fast and accurate gesture
 *     recognizer. Proceedings of the ACM Conference on Human
 *     Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *     (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *     https://dl.acm.org/citation.cfm?id=1753654
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved. Last updated July 14, 2018.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
    this.X = x;
    this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
    this.X = x;
    this.Y = y;
    this.Width = width;
    this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
    this.Name = name;
    this.Points = Resample(points, NumPoints);
    var radians = IndicativeAngle(this.Points);
    this.Points = RotateBy(this.Points, -radians);
    this.Points = ScaleTo(this.Points, SquareSize);
    this.Points = TranslateTo(this.Points, Origin);
    this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score, ms) // constructor
{
    this.Name = name;
    this.Score = score;
    this.Time = ms;
}
//
// DollarRecognizer constants
//
const NumUnistrokes = 6;
const NumPoints = 64;
const SquareSize = 250.0;
const Origin = new Point(0,0);
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = 0.5 * Diagonal;
const AngleRange = Deg2Rad(45.0);
const AnglePrecision = Deg2Rad(2.0);
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
    //
    // one built-in unistroke per gesture type
    //
    this.Unistrokes = new Array(NumUnistrokes);
    this.Unistrokes[0] = new Unistroke("angry", new Array(new Point(87,142),new Point(89,145),new Point(91,148),new Point(93,151),new Point(96,155),new Point(98,157),new Point(100,160),new Point(102,162),new Point(106,167),new Point(108,169),new Point(110,171),new Point(115,177),new Point(119,183),new Point(123,189),new Point(127,193),new Point(129,196),new Point(133,200),new Point(137,206),new Point(140,209),new Point(143,212),new Point(146,215),new Point(151,220),new Point(153,222),new Point(155,223),new Point(157,225),new Point(158,223),new Point(157,218),new Point(155,211),new Point(154,208),new Point(152,200),new Point(150,189),new Point(148,179),new Point(147,170),new Point(147,158),new Point(147,148),new Point(147,141),new Point(147,136),new Point(144,135),new Point(142,137),new Point(140,139),new Point(135,145),new Point(131,152),new Point(124,163),new Point(116,177),new Point(108,191),new Point(100,206),new Point(94,217),new Point(91,222),new Point(89,225),new Point(87,226),new Point(87,224)));
    this.Unistrokes[1] = new Unistroke("like", new Array(new Point(162,302.5),new Point(165,307.5),new Point(166,308.5),new Point(167,309.5),new Point(169,310.5),new Point(170,312.5),new Point(172,313.5),new Point(174,315.5),new Point(176,317.5),new Point(178,319.5),new Point(180,320.5),new Point(182,322.5),new Point(184,323.5),new Point(186,325.5),new Point(191,328.5),new Point(193,330.5),new Point(196,331.5),new Point(199,333.5),new Point(201,335.5),new Point(204,337.5),new Point(206,339.5),new Point(209,341.5),new Point(211,343.5),new Point(213,345.5),new Point(215,348.5),new Point(217,350.5),new Point(219,352.5),new Point(220,354.5),new Point(222,356.5),new Point(223,358.5),new Point(224,360.5),new Point(225,362.5),new Point(226,363.5),new Point(227,364.5),new Point(228,366.5),new Point(228,366.5),new Point(229,367.5),new Point(230,368.5),new Point(230,368.5),new Point(231,369.5),new Point(231,369.5),new Point(232,370.5),new Point(232,370.5),new Point(233,369.5),new Point(234,369.5),new Point(235,369.5),new Point(235,367.5),new Point(236,366.5),new Point(238,364.5),new Point(239,361.5),new Point(240,357.5),new Point(242,353.5),new Point(244,348.5),new Point(246,343.5),new Point(248,337.5),new Point(251,331.5),new Point(254,324.5),new Point(256,318.5),new Point(260,310.5),new Point(263,303.5),new Point(267,296.5),new Point(271,288.5),new Point(275,280.5),new Point(279,272.5),new Point(283,263.5),new Point(287,254.5),new Point(291,245.5),new Point(295,236.5),new Point(299,228.5),new Point(303,219.5),new Point(308,210.5),new Point(312,201.5),new Point(316,193.5),new Point(320,186.5),new Point(324,180.5),new Point(327,174.5),new Point(331,169.5),new Point(334,165.5),new Point(339,158.5),new Point(341,156.5),new Point(342,154.5),new Point(345,151.5),new Point(345,151.5),new Point(346,151.5)));
    this.Unistrokes[2] = new Unistroke("love", new Array(new Point(72,157),new Point(72,158),new Point(72,158),new Point(72,158),new Point(72,158),new Point(73,159),new Point(73,160),new Point(73,160),new Point(74,161),new Point(74,162),new Point(74,163),new Point(75,163),new Point(76,164),new Point(76,166),new Point(78,169),new Point(79,170),new Point(79,172),new Point(82,176),new Point(83,179),new Point(84,182),new Point(86,184),new Point(87,187),new Point(88,189),new Point(90,192),new Point(91,195),new Point(93,198),new Point(95,200),new Point(97,203),new Point(99,206),new Point(100,208),new Point(102,211),new Point(104,214),new Point(106,217),new Point(108,220),new Point(109,223),new Point(111,226),new Point(113,229),new Point(114,232),new Point(116,235),new Point(117,237),new Point(119,240),new Point(120,242),new Point(122,245),new Point(123,248),new Point(124,250),new Point(126,253),new Point(127,255),new Point(128,257),new Point(129,260),new Point(130,262),new Point(131,264),new Point(132,267),new Point(133,269),new Point(134,272),new Point(136,274),new Point(137,276),new Point(138,279),new Point(139,281),new Point(140,283),new Point(142,285),new Point(143,287),new Point(144,290),new Point(145,292),new Point(146,294),new Point(147,296),new Point(148,297),new Point(149,299),new Point(149,301),new Point(150,303),new Point(151,304),new Point(152,306),new Point(153,307),new Point(153,308),new Point(154,310),new Point(155,311),new Point(155,312),new Point(156,313),new Point(156,313),new Point(156,314),new Point(157,315),new Point(157,316),new Point(157,316),new Point(158,317),new Point(158,317),new Point(158,318),new Point(158,318),new Point(158,318),new Point(158,319),new Point(158,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,319),new Point(159,318),new Point(159,317),new Point(160,317),new Point(160,316),new Point(161,316),new Point(161,315),new Point(162,314),new Point(162,313),new Point(163,312),new Point(164,311),new Point(164,310),new Point(165,309),new Point(166,308),new Point(166,306),new Point(167,305),new Point(168,304),new Point(168,303),new Point(169,302),new Point(170,301),new Point(170,300),new Point(171,299),new Point(172,298),new Point(173,297),new Point(173,296),new Point(174,295),new Point(174,293),new Point(175,292),new Point(175,291),new Point(176,290),new Point(177,289),new Point(177,288),new Point(178,287),new Point(179,285),new Point(180,284),new Point(180,283),new Point(181,281),new Point(182,280),new Point(182,278),new Point(183,277),new Point(184,275),new Point(184,274),new Point(185,272),new Point(185,271),new Point(186,269),new Point(187,268),new Point(187,266),new Point(188,265),new Point(188,263),new Point(189,261),new Point(189,260),new Point(190,258),new Point(190,257),new Point(191,256),new Point(191,254),new Point(192,253),new Point(192,251),new Point(192,249),new Point(193,247),new Point(193,245),new Point(194,244),new Point(194,242),new Point(194,240),new Point(195,239),new Point(195,237),new Point(196,236),new Point(196,234),new Point(196,232),new Point(197,230),new Point(197,229),new Point(198,227),new Point(198,226),new Point(198,224),new Point(199,222),new Point(199,220),new Point(199,219),new Point(199,217),new Point(200,216),new Point(200,215),new Point(201,213),new Point(201,212),new Point(202,210),new Point(202,209),new Point(202,207),new Point(203,206),new Point(203,205),new Point(204,203),new Point(204,202),new Point(204,201),new Point(205,199),new Point(205,197),new Point(206,196),new Point(206,194),new Point(206,192),new Point(207,190),new Point(207,189),new Point(208,187),new Point(208,185),new Point(208,183),new Point(209,181),new Point(209,179),new Point(209,178),new Point(210,176),new Point(210,174),new Point(211,173),new Point(211,171),new Point(212,170),new Point(212,169),new Point(213,167),new Point(213,166),new Point(214,165),new Point(214,165),new Point(215,164),new Point(215,164),new Point(215,164),new Point(215,163),new Point(215,163),new Point(215,163),new Point(215,163),new Point(215,163),new Point(215,163),new Point(215,163),new Point(215,163),new Point(215,163),new Point(214,163),new Point(214,163),new Point(213,163),new Point(213,162),new Point(212,161),new Point(212,160),new Point(211,159),new Point(210,158),new Point(210,157),new Point(209,156),new Point(208,155),new Point(208,154),new Point(207,152),new Point(206,151),new Point(204,149),new Point(203,147),new Point(202,145),new Point(200,143),new Point(199,141),new Point(197,139),new Point(196,137),new Point(194,135),new Point(193,134),new Point(192,132),new Point(190,130),new Point(188,129),new Point(187,127),new Point(185,126),new Point(183,125),new Point(181,123),new Point(179,122),new Point(177,121),new Point(176,121),new Point(174,120),new Point(172,119),new Point(170,118),new Point(169,118),new Point(167,118),new Point(165,118),new Point(164,118),new Point(162,118),new Point(160,119),new Point(158,119),new Point(157,119),new Point(155,120),new Point(154,120),new Point(152,121),new Point(151,121),new Point(150,122),new Point(149,122),new Point(148,123),new Point(147,123),new Point(146,124),new Point(145,125),new Point(144,126),new Point(144,126),new Point(143,127),new Point(142,128),new Point(141,128),new Point(141,129),new Point(140,130),new Point(140,131),new Point(140,132),new Point(139,133),new Point(139,134),new Point(139,136),new Point(139,137),new Point(139,139),new Point(139,140),new Point(139,142),new Point(139,144),new Point(139,146),new Point(139,147),new Point(139,149),new Point(139,151),new Point(139,153),new Point(140,155),new Point(140,157),new Point(140,159),new Point(141,161),new Point(141,163),new Point(141,166),new Point(141,168),new Point(142,170),new Point(142,171),new Point(142,173),new Point(142,175),new Point(142,176),new Point(142,178),new Point(142,179),new Point(142,180),new Point(142,181),new Point(142,182),new Point(142,183),new Point(142,183),new Point(142,184),new Point(142,184),new Point(142,184),new Point(142,184),new Point(142,184),new Point(142,184),new Point(142,183),new Point(142,182),new Point(141,181),new Point(141,180),new Point(141,179),new Point(141,178),new Point(140,177),new Point(140,176),new Point(139,175),new Point(139,173),new Point(138,172),new Point(138,171),new Point(137,169),new Point(136,168),new Point(135,166),new Point(134,164),new Point(133,162),new Point(132,160),new Point(131,158),new Point(130,156),new Point(129,154),new Point(128,152),new Point(126,150),new Point(125,148),new Point(124,146),new Point(123,144),new Point(121,141),new Point(120,139),new Point(118,137),new Point(117,136),new Point(115,134),new Point(114,133),new Point(113,131),new Point(112,130),new Point(110,129),new Point(109,128),new Point(107,127),new Point(106,126),new Point(104,125),new Point(103,125),new Point(102,124),new Point(100,124),new Point(98,123),new Point(96,123),new Point(95,123),new Point(93,122),new Point(91,122),new Point(90,123),new Point(89,123),new Point(88,123),new Point(86,123),new Point(85,124),new Point(84,124),new Point(83,125),new Point(83,125),new Point(82,126),new Point(81,127),new Point(81,128),new Point(80,128),new Point(80,129),new Point(79,131),new Point(79,132),new Point(78,133),new Point(77,134),new Point(77,136),new Point(76,137),new Point(76,138),new Point(75,140),new Point(74,141),new Point(74,143),new Point(74,144),new Point(73,146),new Point(73,147),new Point(74,149),new Point(74,150),new Point(75,152),new Point(76,154),new Point(77,155),new Point(78,157),new Point(79,159),new Point(80,160),new Point(81,162),new Point(81,163),new Point(83,166),new Point(84,167),new Point(85,168),new Point(85,169),new Point(85,169),new Point(85,169),new Point(85,169)));
    this.Unistrokes[3] = new Unistroke("joy", new Array(new Point(70,219),new Point(71,222),new Point(71,223),new Point(72,224),new Point(72,226),new Point(73,227),new Point(74,229),new Point(76,233),new Point(78,235),new Point(79,237),new Point(82,242),new Point(83,244),new Point(85,247),new Point(87,249),new Point(89,252),new Point(91,254),new Point(93,257),new Point(95,259),new Point(98,262),new Point(100,264),new Point(103,267),new Point(105,270),new Point(108,272),new Point(111,275),new Point(113,277),new Point(116,280),new Point(118,282),new Point(121,285),new Point(124,287),new Point(127,290),new Point(129,292),new Point(132,294),new Point(134,296),new Point(137,298),new Point(140,301),new Point(143,302),new Point(146,304),new Point(149,306),new Point(152,308),new Point(155,309),new Point(158,310),new Point(161,311),new Point(164,312),new Point(167,313),new Point(170,313),new Point(174,313),new Point(177,313),new Point(181,313),new Point(185,313),new Point(188,312),new Point(192,311),new Point(196,310),new Point(200,309),new Point(204,308),new Point(207,307),new Point(211,306),new Point(214,304),new Point(218,302),new Point(222,300),new Point(226,298),new Point(230,295),new Point(234,292),new Point(237,288),new Point(241,284),new Point(245,280),new Point(249,275),new Point(253,270),new Point(256,264),new Point(260,257),new Point(264,249),new Point(267,241),new Point(270,233),new Point(272,226),new Point(273,219),new Point(275,213),new Point(276,207),new Point(277,202),new Point(280,195),new Point(282,191),new Point(282,190),new Point(283,190)));
    this.Unistrokes[4] = new Unistroke("laugh", new Array(new Point(88,220),new Point(88,220),new Point(88,220),new Point(88,220),new Point(88,220),new Point(88,220),new Point(89,220),new Point(89,219),new Point(90,219),new Point(91,219),new Point(92,219),new Point(93,219),new Point(94,219),new Point(95,219),new Point(97,219),new Point(98,219),new Point(100,219),new Point(101,218),new Point(103,218),new Point(105,218),new Point(107,218),new Point(109,218),new Point(111,218),new Point(114,218),new Point(116,218),new Point(119,218),new Point(121,218),new Point(124,218),new Point(126,218),new Point(129,218),new Point(132,218),new Point(136,218),new Point(139,218),new Point(142,217),new Point(146,217),new Point(149,216),new Point(153,216),new Point(157,215),new Point(161,215),new Point(165,214),new Point(169,214),new Point(174,213),new Point(178,212),new Point(183,212),new Point(187,211),new Point(192,211),new Point(196,211),new Point(201,211),new Point(206,211),new Point(210,210),new Point(215,210),new Point(219,210),new Point(224,210),new Point(228,209),new Point(231,209),new Point(235,209),new Point(239,209),new Point(242,209),new Point(246,209),new Point(249,208),new Point(253,208),new Point(256,208),new Point(259,208),new Point(263,207),new Point(266,207),new Point(270,206),new Point(273,206),new Point(277,206),new Point(280,205),new Point(287,205),new Point(290,205),new Point(293,205),new Point(295,205),new Point(298,205),new Point(300,206),new Point(302,206),new Point(304,206),new Point(306,207),new Point(308,208),new Point(309,208),new Point(310,209),new Point(311,209),new Point(312,209),new Point(313,210),new Point(313,211),new Point(313,211),new Point(314,211),new Point(314,212),new Point(314,212),new Point(314,212),new Point(314,212),new Point(314,212),new Point(314,213),new Point(314,213),new Point(314,213),new Point(314,213),new Point(314,213),new Point(314,214),new Point(314,214),new Point(313,215),new Point(313,215),new Point(313,216),new Point(313,216),new Point(312,217),new Point(312,217),new Point(312,217),new Point(311,218),new Point(311,219),new Point(311,221),new Point(310,222),new Point(310,223),new Point(309,224),new Point(309,226),new Point(308,228),new Point(308,230),new Point(307,233),new Point(306,235),new Point(306,238),new Point(305,241),new Point(303,244),new Point(302,247),new Point(301,251),new Point(299,254),new Point(297,257),new Point(295,261),new Point(293,264),new Point(291,268),new Point(288,271),new Point(285,274),new Point(281,277),new Point(278,280),new Point(275,283),new Point(272,286),new Point(269,289),new Point(266,292),new Point(262,295),new Point(259,297),new Point(256,299),new Point(252,301),new Point(249,302),new Point(245,304),new Point(242,305),new Point(239,307),new Point(236,308),new Point(233,309),new Point(230,310),new Point(227,311),new Point(224,311),new Point(221,312),new Point(219,312),new Point(216,313),new Point(213,313),new Point(211,313),new Point(208,314),new Point(205,314),new Point(202,314),new Point(199,314),new Point(197,314),new Point(194,314),new Point(191,313),new Point(188,313),new Point(185,313),new Point(182,312),new Point(179,312),new Point(176,311),new Point(173,310),new Point(170,310),new Point(167,308),new Point(164,307),new Point(161,306),new Point(158,305),new Point(155,303),new Point(153,302),new Point(150,300),new Point(147,298),new Point(144,297),new Point(142,295),new Point(139,293),new Point(136,291),new Point(134,289),new Point(131,287),new Point(129,285),new Point(127,283),new Point(125,282),new Point(123,280),new Point(121,278),new Point(119,276),new Point(117,274),new Point(116,272),new Point(114,270),new Point(113,268),new Point(111,266),new Point(109,263),new Point(108,261),new Point(106,259),new Point(105,257),new Point(103,255),new Point(101,253),new Point(99,251),new Point(97,248),new Point(96,246),new Point(94,244),new Point(93,242),new Point(91,240),new Point(90,238),new Point(89,235),new Point(88,233),new Point(87,231),new Point(86,229),new Point(85,227),new Point(85,225),new Point(85,223),new Point(85,221),new Point(85,219),new Point(85,217),new Point(85,215),new Point(85,214),new Point(86,213),new Point(86,212),new Point(87,211),new Point(87,211)));
    this.Unistrokes[5] = new Unistroke("sad", new Array(new Point(331,281),new Point(331,280),new Point(332,279),new Point(332,277),new Point(333,276),new Point(334,274),new Point(334,273),new Point(335,271),new Point(336,269),new Point(337,267),new Point(338,264),new Point(338,262),new Point(339,260),new Point(340,258),new Point(341,256),new Point(342,254),new Point(342,253),new Point(343,251),new Point(343,250),new Point(343,249),new Point(344,248),new Point(344,247),new Point(345,246),new Point(345,245),new Point(346,243),new Point(347,242),new Point(347,240),new Point(348,239),new Point(348,237),new Point(349,236),new Point(350,235),new Point(350,233),new Point(351,232),new Point(351,231),new Point(351,231),new Point(352,230),new Point(352,229),new Point(352,228),new Point(352,228),new Point(353,227),new Point(354,226),new Point(354,225),new Point(355,225),new Point(356,224),new Point(357,223),new Point(358,222),new Point(360,221),new Point(362,220),new Point(363,219),new Point(365,219),new Point(367,218),new Point(369,217),new Point(371,216),new Point(373,216),new Point(375,215),new Point(377,215),new Point(379,215),new Point(382,214),new Point(384,214),new Point(386,214),new Point(388,214),new Point(390,214),new Point(391,214),new Point(393,214),new Point(394,214),new Point(395,214),new Point(397,214),new Point(398,214),new Point(399,215),new Point(400,215),new Point(401,215),new Point(402,215),new Point(402,215),new Point(403,216),new Point(404,216),new Point(405,216),new Point(406,216),new Point(407,216),new Point(408,217),new Point(409,217),new Point(410,217),new Point(412,218),new Point(413,218),new Point(415,219),new Point(416,219),new Point(418,220),new Point(419,220),new Point(421,221),new Point(422,222),new Point(423,223),new Point(425,224),new Point(426,224),new Point(427,225),new Point(428,226),new Point(429,227),new Point(430,228),new Point(431,230),new Point(432,231),new Point(433,233),new Point(435,235),new Point(436,237),new Point(438,238),new Point(439,240),new Point(440,241),new Point(441,243),new Point(442,244),new Point(444,245),new Point(445,246),new Point(445,247),new Point(446,249),new Point(447,250),new Point(448,251),new Point(449,252),new Point(450,253),new Point(451,254),new Point(452,256),new Point(453,257),new Point(453,259),new Point(454,260),new Point(454,261),new Point(455,261),new Point(455,263),new Point(455,263),new Point(455,264),new Point(455,264),new Point(455,264),new Point(455,265),new Point(455,265),new Point(455,265)));
    //
    // The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
    //
    this.Recognize = function(points, useProtractor)
    {
        var t0 = Date.now();
        var candidate = new Unistroke("", points);

        var u = -1;
        var b = +Infinity;
        for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke template
        {
            var d;
            if (useProtractor)
                d = OptimalCosineDistance(this.Unistrokes[i].Vector, candidate.Vector); // Protractor
            else
                d = DistanceAtBestAngle(candidate.Points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision); // Golden Section Search (original $1)
            if (d < b) {
                b = d; // best (least) distance
                u = i; // unistroke index
            }
        }
        var t1 = Date.now();
        return (u == -1) ? new Result("No match.", 0.0, t1-t0) : new Result(this.Unistrokes[u].Name, useProtractor ? (1.0 - b) : (1.0 - b / HalfDiagonal), t1-t0);
    }
    this.AddGesture = function(name, points)
    {
        this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
        var num = 0;
        for (var i = 0; i < this.Unistrokes.length; i++) {
            if (this.Unistrokes[i].Name == name)
                num++;
        }
        return num;
    }
    this.DeleteUserGestures = function()
    {
        this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
        return NumUnistrokes;
    }
}
//
// Private helper functions from here on down
//
function Resample(points, n)
{
    var I = PathLength(points) / (n - 1); // interval length
    var D = 0.0;
    var newpoints = new Array(points[0]);
    for (var i = 1; i < points.length; i++)
    {
        var d = Distance(points[i-1], points[i]);
        if ((D + d) >= I)
        {
            var qx = points[i-1].X + ((I - D) / d) * (points[i].X - points[i-1].X);
            var qy = points[i-1].Y + ((I - D) / d) * (points[i].Y - points[i-1].Y);
            var q = new Point(qx, qy);
            newpoints[newpoints.length] = q; // append new point 'q'
            points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
            D = 0.0;
        }
        else D += d;
    }
    if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
        newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
    return newpoints;
}
function IndicativeAngle(points)
{
    var c = Centroid(points);
    return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
    var c = Centroid(points);
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var newpoints = new Array();
    for (var i = 0; i < points.length; i++) {
        var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
        var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
        newpoints[newpoints.length] = new Point(qx, qy);
    }
    return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
    var B = BoundingBox(points);
    var newpoints = new Array();
    for (var i = 0; i < points.length; i++) {
        var qx = points[i].X * (size / B.Width);
        var qy = points[i].Y * (size / B.Height);
        newpoints[newpoints.length] = new Point(qx, qy);
    }
    return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
    var c = Centroid(points);
    var newpoints = new Array();
    for (var i = 0; i < points.length; i++) {
        var qx = points[i].X + pt.X - c.X;
        var qy = points[i].Y + pt.Y - c.Y;
        newpoints[newpoints.length] = new Point(qx, qy);
    }
    return newpoints;
}
function Vectorize(points) // for Protractor
{
    var sum = 0.0;
    var vector = new Array();
    for (var i = 0; i < points.length; i++) {
        vector[vector.length] = points[i].X;
        vector[vector.length] = points[i].Y;
        sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
    }
    var magnitude = Math.sqrt(sum);
    for (var i = 0; i < vector.length; i++)
        vector[i] /= magnitude;
    return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
    var a = 0.0;
    var b = 0.0;
    for (var i = 0; i < v1.length; i += 2) {
        a += v1[i] * v2[i] + v1[i+1] * v2[i+1];
        b += v1[i] * v2[i+1] - v1[i+1] * v2[i];
    }
    var angle = Math.atan(b / a);
    return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
    var x1 = Phi * a + (1.0 - Phi) * b;
    var f1 = DistanceAtAngle(points, T, x1);
    var x2 = (1.0 - Phi) * a + Phi * b;
    var f2 = DistanceAtAngle(points, T, x2);
    while (Math.abs(b - a) > threshold)
    {
        if (f1 < f2) {
            b = x2;
            x2 = x1;
            f2 = f1;
            x1 = Phi * a + (1.0 - Phi) * b;
            f1 = DistanceAtAngle(points, T, x1);
        } else {
            a = x1;
            x1 = x2;
            f1 = f2;
            x2 = (1.0 - Phi) * a + Phi * b;
            f2 = DistanceAtAngle(points, T, x2);
        }
    }
    return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
    var newpoints = RotateBy(points, radians);
    return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
    var x = 0.0, y = 0.0;
    for (var i = 0; i < points.length; i++) {
        x += points[i].X;
        y += points[i].Y;
    }
    x /= points.length;
    y /= points.length;
    return new Point(x, y);
}
function BoundingBox(points)
{
    var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
    for (var i = 0; i < points.length; i++) {
        minX = Math.min(minX, points[i].X);
        minY = Math.min(minY, points[i].Y);
        maxX = Math.max(maxX, points[i].X);
        maxY = Math.max(maxY, points[i].Y);
    }
    return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
    var d = 0.0;
    for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
        d += Distance(pts1[i], pts2[i]);
    return d / pts1.length;
}
function PathLength(points)
{
    var d = 0.0;
    for (var i = 1; i < points.length; i++)
        d += Distance(points[i - 1], points[i]);
    return d;
}
function Distance(p1, p2)
{
    var dx = p2.X - p1.X;
    var dy = p2.Y - p1.Y;
    return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }