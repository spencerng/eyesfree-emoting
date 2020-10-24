/**
 * The $P+ Point-Cloud Recognizer (JavaScript version)
 *
 *  Radu-Daniel Vatavu, Ph.D.
 *  University Stefan cel Mare of Suceava
 *  Suceava 720229, Romania
 *  vatavu@eed.usv.ro
 *
 * The academic publication for the $P+ recognizer, and what should be
 * used to cite it, is:
 *
 *     Vatavu, R.-D. (2017). Improving gesture recognition accuracy on
 *     touch screens for users with low vision. Proceedings of the ACM
 *     Conference on Human Factors in Computing Systems (CHI '17). Denver,
 *     Colorado (May 6-11, 2017). New York: ACM Press, pp. 4667-4679.
 *     https://dl.acm.org/citation.cfm?id=3025941
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2017-2018, Radu-Daniel Vatavu and Jacob O. Wobbrock. All
 * rights reserved. Last updated July 14, 2018.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the name of the University Stefan cel Mare of Suceava, nor the
 *      names of its contributors may be used to endorse or promote products
 *      derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Radu-Daniel Vatavu OR Lisa Anthony
 * OR Jacob O. Wobbrock BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
 * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y, id, angle = 0.0)
{
	this.X = x;
	this.Y = y;
	this.ID = id;
	this.Angle = angle; // normalized turning angle, $P+
}
//
// PointCloud class: a point-cloud template
//
function PointCloud(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	this.Points = Scale(this.Points);
	this.Points = TranslateTo(this.Points, Origin);
	this.Points = ComputeNormalizedTurningAngles(this.Points); // $P+
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
// PDollarPlusRecognizer constants
//
const NumPointClouds = 6;
const NumPoints = 32;
const Origin = new Point(0,0,0);
//
// PDollarPlusRecognizer class
//
function PDollarPlusRecognizer() // constructor
{
	//
	// one predefined point-cloud for each gesture
	//
	this.PointClouds = new Array(NumPointClouds);
	this.PointClouds = new Array(NumPointClouds);
    this.PointClouds[0] = new PointCloud("angry", new Array(new Point(455,201,1),new Point(467,219.5,1),new Point(469.5,223,1),new Point(472.5,226.5,1),new Point(476,230,1),new Point(478.5,233,1),new Point(482,236,1),new Point(485,239.5,1),new Point(488.5,243,1),new Point(491.5,247,1),new Point(495.5,250.5,1),new Point(498.5,254,1),new Point(502,258,1),new Point(505,262,1),new Point(508.5,266.5,1),new Point(512,270.5,1),new Point(516,274.5,1),new Point(519.5,278.5,1),new Point(523,282.5,1),new Point(526,286.5,1),new Point(529.5,290.5,1),new Point(533,294.5,1),new Point(536.5,298,1),new Point(540.5,302,1),new Point(543.5,306,1),new Point(547,310.5,1),new Point(550.5,316,1),new Point(554.5,321,1),new Point(559,326.5,1),new Point(563,331.5,1),new Point(566.5,337,1),new Point(570,342,1),new Point(574,347,1),new Point(577.5,351.5,1),new Point(581,355.5,1),new Point(584,359,1),new Point(586.5,362,1),new Point(589.5,364,1),new Point(592,366,1),new Point(594.5,368,1),new Point(576.5,203,2),new Point(560,214,2),new Point(557.5,217,2),new Point(555,220.5,2),new Point(552.5,224,2),new Point(549.5,227.5,2),new Point(547,231.5,2),new Point(545,236,2),new Point(543,241,2),new Point(541.5,245.5,2),new Point(540.5,250.5,2),new Point(539.5,255,2),new Point(539,259.5,2),new Point(538.5,264.5,2),new Point(538,269.5,2),new Point(537.5,274,2),new Point(537,279,2),new Point(535.5,284,2),new Point(532.5,290,2),new Point(529,296,2),new Point(525.5,302.5,2),new Point(521.5,308.5,2),new Point(517,314.5,2),new Point(512,320,2),new Point(507,326,2),new Point(502,332,2),new Point(497,338.5,2),new Point(492.5,344.5,2),new Point(488,350,2),new Point(484,355,2),new Point(481,359.5,2),new Point(478.5,363.5,2),new Point(477,366.5,2),new Point(476.5,368.5,2),new Point(476,370.5,2),new Point(475.5,372.5,2),new Point(476,373.5,2),new Point(476.5,374.5,2)));
    this.PointClouds[1] = new PointCloud("like", new Array(new Point(477,414.5,1),new Point(481.5,430,1),new Point(482,432,1),new Point(482.5,434,1),new Point(484,438.5,1),new Point(485,440.5,1),new Point(486,442.5,1),new Point(489,446.5,1),new Point(490.5,448.5,1),new Point(492,450,1),new Point(494,452,1),new Point(496,453.5,1),new Point(497.5,455.5,1),new Point(499,457,1),new Point(500,458.5,1),new Point(501,460.5,1),new Point(502,462.5,1),new Point(503,464,1),new Point(504,466.5,1),new Point(505,468.5,1),new Point(505.5,470.5,1),new Point(506.5,472.5,1),new Point(507,474.5,1),new Point(507.5,476.5,1),new Point(508.5,478,1),new Point(509,479,1),new Point(509.5,480,1),new Point(510.5,480.5,1),new Point(511,481.5,1),new Point(511.5,482.5,1),new Point(511.5,483,1),new Point(512,483.5,1),new Point(512,484,1),new Point(512,484.5,1),new Point(512,485,1),new Point(512.5,485,1),new Point(513,483.5,1),new Point(513.5,482.5,1),new Point(514,481.5,1),new Point(515,480.5,1),new Point(516,479.5,1),new Point(517,478.5,1),new Point(518.5,477,1),new Point(519.5,475,1),new Point(521,473,1),new Point(522.5,471,1),new Point(523.5,468.5,1),new Point(525,466,1),new Point(527,463.5,1),new Point(529,460,1),new Point(532.5,455.5,1),new Point(536,450.5,1),new Point(540.5,444.5,1),new Point(545.5,437,1),new Point(552.5,428,1),new Point(559,417.5,1),new Point(566,407,1),new Point(574,395,1),new Point(599,357,1),new Point(606.5,344.5,1),new Point(613,333.5,1),new Point(619,323.5,1),new Point(624.5,314.5,1),new Point(628.5,306.5,1),new Point(632,299.5,1),new Point(634,293,1),new Point(636,287.5,1)));
    this.PointClouds[2] = new PointCloud("love", new Array(new Point(402.5,317.5,1),new Point(404.5,337,1),new Point(405.5,341,1),new Point(406,344.5,1),new Point(407,348,1),new Point(411,359,1),new Point(412.5,361.5,1),new Point(414,364.5,1),new Point(415.5,367,1),new Point(417.5,369.5,1),new Point(419,373,1),new Point(421,376.5,1),new Point(423.5,380,1),new Point(426,383.5,1),new Point(429,387.5,1),new Point(432,391,1),new Point(434.5,395,1),new Point(437,399,1),new Point(439.5,403,1),new Point(442,407,1),new Point(443.5,411.5,1),new Point(446,415.5,1),new Point(448,419.5,1),new Point(450.5,423.5,1),new Point(452.5,427,1),new Point(455,431,1),new Point(456.5,434.5,1),new Point(458.5,438,1),new Point(459.5,440.5,1),new Point(461,443,1),new Point(462,445,1),new Point(463,447,1),new Point(464,448.5,1),new Point(465,450,1),new Point(466.5,451,1),new Point(468,452.5,1),new Point(470,453.5,1),new Point(472,454.5,1),new Point(473.5,455,1),new Point(475,456,1),new Point(476.5,457,1),new Point(478,458,1),new Point(479.5,459.5,1),new Point(481,460.5,1),new Point(482,462,1),new Point(483.5,464,1),new Point(484.5,465,1),new Point(486,467,1),new Point(487,468.5,1),new Point(488,470,1),new Point(488.5,471.5,1),new Point(489,473,1),new Point(489.5,473.5,1),new Point(489.5,474,1),new Point(489,474,1),new Point(489,472.5,1),new Point(490,471,1),new Point(490.5,469.5,1),new Point(491.5,467.5,1),new Point(492.5,465,1),new Point(494,462.5,1),new Point(495,459.5,1),new Point(496.5,456,1),new Point(497.5,452.5,1),new Point(498.5,448.5,1),new Point(500,444.5,1),new Point(501,440,1),new Point(502,435,1),new Point(503,429.5,1),new Point(503.5,424,1),new Point(504.5,418,1),new Point(505,411.5,1),new Point(506,405.5,1),new Point(506.5,399,1),new Point(507,392.5,1),new Point(508,386,1),new Point(508.5,380,1),new Point(509,374,1),new Point(509.5,369,1),new Point(510,364,1),new Point(510.5,359.5,1),new Point(511.5,354.5,1),new Point(512.5,350,1),new Point(513.5,344.5,1),new Point(515,339.5,1),new Point(517,334,1),new Point(518.5,328,1),new Point(520,322,1),new Point(521.5,317,1),new Point(522,312.5,1),new Point(522,309,1),new Point(522,306,1),new Point(521,303,1),new Point(520,301,1),new Point(518.5,298.5,1),new Point(516.5,297,1),new Point(515,295.5,1),new Point(512.5,294.5,1),new Point(510.5,293.5,1),new Point(508,292.5,1),new Point(505.5,292,1),new Point(503,291,1),new Point(501,290.5,1),new Point(499,290,1),new Point(497.5,290,1),new Point(495,289.5,1),new Point(492.5,289.5,1),new Point(490,289.5,1),new Point(487.5,289.5,1),new Point(484.5,290,1),new Point(482.5,290.5,1),new Point(480.5,291.5,1),new Point(479,293,1),new Point(477,294.5,1),new Point(475.5,297,1),new Point(473.5,300.5,1),new Point(472,304,1),new Point(470.5,308,1),new Point(469,311.5,1),new Point(468.5,315,1),new Point(467.5,318.5,1),new Point(467.5,322,1),new Point(467,325,1),new Point(467,328.5,1),new Point(467.5,332,1),new Point(468,335,1),new Point(468.5,338,1),new Point(469,340.5,1),new Point(470,343,1),new Point(471,346,1),new Point(471.5,348,1),new Point(472.5,350.5,1),new Point(473.5,352,1),new Point(474.5,353.5,1),new Point(475,354.5,1),new Point(476,355,1),new Point(476.5,355,1),new Point(477,354.5,1),new Point(477.5,354,1),new Point(477.5,353,1),new Point(477.5,352,1),new Point(478,351,1),new Point(478,349.5,1),new Point(477.5,348.5,1),new Point(477.5,347,1),new Point(477.5,346,1),new Point(477,345,1),new Point(476,344,1),new Point(475,343,1),new Point(473.5,341.5,1),new Point(472,340,1),new Point(470,338,1),new Point(468.5,336,1),new Point(466,334,1),new Point(464,332,1),new Point(462,329.5,1),new Point(459.5,326,1),new Point(458,323,1),new Point(456,320,1),new Point(453.5,317.5,1),new Point(450.5,314.5,1),new Point(447,312,1),new Point(443.5,309.5,1),new Point(439.5,307.5,1),new Point(436,305.5,1),new Point(433,303.5,1),new Point(430,302,1),new Point(427,301,1),new Point(423.5,300.5,1),new Point(421,300,1),new Point(418.5,300,1),new Point(416,300.5,1),new Point(414.5,301.5,1),new Point(413,303,1),new Point(412,304.5,1),new Point(410.5,307,1),new Point(409.5,309,1),new Point(409,311.5,1),new Point(408.5,314,1),new Point(408,316.5,1),new Point(408,319.5,1),new Point(408,322.5,1),new Point(408.5,326,1),new Point(409.5,329.5,1),new Point(410.5,332.5,1),new Point(411.5,336,1),new Point(412.5,339,1),new Point(413.5,343,1),new Point(414.5,346.5,1),new Point(415.5,350,1),new Point(416.5,353.5,1),new Point(417,356,1),new Point(418,358.5,1),new Point(419,359.5,1),new Point(419.5,360.5,1),new Point(420.5,360.5,1),new Point(422,359.5,1)));
    this.PointClouds[3] = new PointCloud("yay", new Array(new Point(365.5,365.5,1),new Point(375,384,1),new Point(376,387.5,1),new Point(376.5,391,1),new Point(377.5,394.5,1),new Point(379,397,1),new Point(380.5,399.5,1),new Point(382.5,401.5,1),new Point(384.5,404,1),new Point(387,405.5,1),new Point(390,407,1),new Point(392.5,408.5,1),new Point(395,410.5,1),new Point(398,413,1),new Point(400.5,415,1),new Point(403.5,417,1),new Point(407,419,1),new Point(410.5,420.5,1),new Point(414.5,422.5,1),new Point(417.5,423.5,1),new Point(421,425,1),new Point(424.5,426,1),new Point(428.5,427,1),new Point(432.5,427.5,1),new Point(436.5,428,1),new Point(440.5,428,1),new Point(445,428,1),new Point(449,427.5,1),new Point(453.5,426.5,1),new Point(457.5,426,1),new Point(461,425,1),new Point(464.5,424,1),new Point(468,423,1),new Point(472,421.5,1),new Point(475.5,419.5,1),new Point(479,417.5,1),new Point(482.5,415.5,1),new Point(485.5,413,1),new Point(488.5,411,1),new Point(491.5,408.5,1),new Point(495,405.5,1),new Point(497.5,402.5,1),new Point(500,399.5,1),new Point(502,396.5,1),new Point(503.5,393,1),new Point(504.5,390,1),new Point(505.5,387,1),new Point(506.5,384,1),new Point(507,381.5,1),new Point(507.5,378.5,1),new Point(507.5,376.5,1),new Point(507.5,374.5,1),new Point(508,373,1),new Point(508,371.5,1),new Point(508,370.5,1),new Point(507.5,369.5,1),new Point(507.5,369,1),new Point(507.5,368,1),new Point(507,368,1),new Point(507.5,367.5,1),new Point(508,367,1),new Point(508.5,367,1),new Point(509,366.5,1)));
    this.PointClouds[4] = new PointCloud("laugh", new Array(new Point(399,297,1),new Point(414.5,298.5,1),new Point(417.5,297.5,1),new Point(422,296,1),new Point(427.5,294,1),new Point(432.5,292,1),new Point(444,287,1),new Point(450,284.5,1),new Point(456.5,282,1),new Point(461.5,280.5,1),new Point(467.5,279,1),new Point(473.5,278,1),new Point(479,277.5,1),new Point(484.5,277,1),new Point(490.5,276,1),new Point(497,275.5,1),new Point(502.5,274.5,1),new Point(508.5,274,1),new Point(514,273,1),new Point(519.5,272.5,1),new Point(524,272,1),new Point(527.5,272,1),new Point(530.5,272,1),new Point(533,272.5,1),new Point(535.5,273,1),new Point(537,273.5,1),new Point(538.5,274,1),new Point(540,275.5,1),new Point(541,276,1),new Point(542.5,277,1),new Point(543.5,277.5,1),new Point(544,278.5,1),new Point(544.5,278.5,1),new Point(545,278.5,1),new Point(545.5,279,1),new Point(545,279,1),new Point(545,278.5,1),new Point(544.5,278.5,1),new Point(544,278.5,1),new Point(543.5,279,1),new Point(543.5,280,1),new Point(543,281.5,1),new Point(542.5,283.5,1),new Point(542,286,1),new Point(541,288.5,1),new Point(540,291.5,1),new Point(539,294,1),new Point(538,296.5,1),new Point(537,299.5,1),new Point(536,303,1),new Point(535,307,1),new Point(533.5,311.5,1),new Point(532,315.5,1),new Point(530.5,320.5,1),new Point(528.5,326,1),new Point(526.5,331.5,1),new Point(524.5,337,1),new Point(522.5,342.5,1),new Point(520,348.5,1),new Point(518,353.5,1),new Point(515,358.5,1),new Point(511.5,362,1),new Point(507.5,365.5,1),new Point(504,368,1),new Point(500.5,370,1),new Point(496.5,371.5,1),new Point(492,372.5,1),new Point(488,373,1),new Point(483.5,373.5,1),new Point(479.5,373,1),new Point(475.5,372.5,1),new Point(471.5,371.5,1),new Point(467.5,370.5,1),new Point(463,369,1),new Point(459,368,1),new Point(456,366.5,1),new Point(453,365.5,1),new Point(449.5,364.5,1),new Point(446,363.5,1),new Point(442.5,362.5,1),new Point(440,361.5,1),new Point(437,360.5,1),new Point(435,359.5,1),new Point(433,358.5,1),new Point(431.5,357.5,1),new Point(429.5,356.5,1),new Point(428,355,1),new Point(426.5,353.5,1),new Point(424,352,1),new Point(422.5,349.5,1),new Point(420.5,347.5,1),new Point(418.5,345,1),new Point(416.5,343,1),new Point(415,340.5,1),new Point(413.5,339,1),new Point(412,337.5,1),new Point(410.5,336,1),new Point(409.5,334,1),new Point(408.5,332.5,1),new Point(408,330.5,1),new Point(407.5,328.5,1),new Point(407.5,326.5,1),new Point(408,324,1),new Point(408.5,322,1),new Point(409,320,1),new Point(409.5,318.5,1),new Point(410,317,1),new Point(410,316,1),new Point(410,315.5,1),new Point(409.5,315,1),new Point(409,314.5,1),new Point(408,314.5,1),new Point(407.5,314.5,1),new Point(407,314.5,1),new Point(406.5,314,1),new Point(406,313.5,1),new Point(406,313,1),new Point(406.5,312,1),new Point(407,311,1),new Point(407.5,310.5,1),new Point(408,309.5,1),new Point(408.5,309,1),new Point(408.5,308.5,1),new Point(408,308.5,1),new Point(407.5,308.5,1),new Point(406.5,309,1),new Point(405,310,1)));
    this.PointClouds[5] = new PointCloud("sad", new Array(new Point(506,456,1),new Point(510.5,440.5,1),new Point(511.5,438,1),new Point(513,435.5,1),new Point(515,432,1),new Point(517,428,1),new Point(519,424,1),new Point(521,420,1),new Point(523,416,1),new Point(524.5,413,1),new Point(526.5,409.5,1),new Point(528.5,407,1),new Point(530.5,404.5,1),new Point(533,402.5,1),new Point(535.5,401,1),new Point(537.5,399.5,1),new Point(539.5,399,1),new Point(541,398.5,1),new Point(543,398.5,1),new Point(544.5,398.5,1),new Point(546,398,1),new Point(548,398.5,1),new Point(550.5,398.5,1),new Point(553,399,1),new Point(556,399.5,1),new Point(559,399.5,1),new Point(562,400,1),new Point(565,400.5,1),new Point(567.5,401,1),new Point(569.5,401.5,1),new Point(572,402.5,1),new Point(574.5,404,1),new Point(577.5,404.5,1),new Point(580,405.5,1),new Point(582.5,406.5,1),new Point(584.5,407.5,1),new Point(586.5,408.5,1),new Point(588,409.5,1),new Point(589.5,410.5,1),new Point(591,411.5,1),new Point(592.5,413,1),new Point(594,415,1),new Point(595.5,416.5,1),new Point(597,419,1),new Point(598.5,421.5,1),new Point(599.5,423.5,1),new Point(601,426,1),new Point(601.5,428.5,1),new Point(602.5,430.5,1),new Point(603.5,432.5,1),new Point(604.5,435,1),new Point(605,437,1),new Point(605.5,439.5,1),new Point(606,441.5,1),new Point(606,444.5,1),new Point(606.5,447,1),new Point(606.5,449,1),new Point(607,451,1),new Point(607,453,1),new Point(607,454.5,1),new Point(607,455.5,1),new Point(607,456,1),new Point(607.5,456,1),new Point(608,453,1)));
	
	//
	// The $P+ Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
	//
	this.Recognize = function(points)
	{
		var t0 = Date.now();
		var candidate = new PointCloud("", points);

		var u = -1;
		var b = +Infinity;
		for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
		{
			var d = Math.min(
				CloudDistance(candidate.Points, this.PointClouds[i].Points),
				CloudDistance(this.PointClouds[i].Points, candidate.Points)
				); // $P+
			if (d < b) {
				b = d; // best (least) distance
				u = i; // point-cloud index
			}
		}
		var t1 = Date.now();
		return (u == -1) ? new Result("No match.", 0.0, t1-t0) : new Result(this.PointClouds[u].Name, b > 1.0 ? 1.0 / b : 1.0, t1-t0);
	}
	this.AddGesture = function(name, points)
	{
		this.PointClouds[this.PointClouds.length] = new PointCloud(name, points);
		var num = 0;
		for (var i = 0; i < this.PointClouds.length; i++) {
			if (this.PointClouds[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.PointClouds.length = NumPointClouds; // clears any beyond the original set
		return NumPointClouds;
	}
}
//
// Private helper functions from here on down
//
function CloudDistance(pts1, pts2) // revised for $P+
{
	var matched = new Array(pts1.length); // pts1.length == pts2.length
	for (var k = 0; k < pts1.length; k++)
		matched[k] = false;
	var sum = 0;
	for (var i = 0; i < pts1.length; i++)
	{
		var index = -1;
		var min = +Infinity;
		for (var j = 0; j < pts1.length; j++)
		{
			var d = DistanceWithAngle(pts1[i], pts2[j]);
			if (d < min) {
				min = d;
				index = j;
			}
		}
		matched[index] = true;
		sum += min;
	}
	for (var j = 0; j < matched.length; j++)
	{
		if (!matched[j]) {
			var min = +Infinity;
			for (var i = 0; i < pts1.length; i++) {
				var d = DistanceWithAngle(pts1[i], pts2[j]);
				if (d < min)
					min = d;
			}
			sum += min;
		}
	}
	return sum;
}
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
		{
			var d = Distance(points[i-1], points[i]);
			if ((D + d) >= I)
			{
				var qx = points[i-1].X + ((I - D) / d) * (points[i].X - points[i-1].X);
				var qy = points[i-1].Y + ((I - D) / d) * (points[i].Y - points[i-1].Y);
				var q = new Point(qx, qy, points[i].ID);
				newpoints[newpoints.length] = q; // append new point 'q'
				points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
				D = 0.0;
			}
			else D += d;
		}
	}
	if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
	return newpoints;
}
function Scale(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	var size = Math.max(maxX - minX, maxY - minY);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - minX) / size;
		var qy = (points[i].Y - minY) / size;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
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
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}
function ComputeNormalizedTurningAngles(points) // $P+
{
	var newpoints = new Array();
	newpoints[0] = new Point(points[0].X, points[0].Y, points[0].ID); // first point
	for (var i = 1; i < points.length - 1; i++)
	{
		var dx = (points[i+1].X - points[i].X) * (points[i].X - points[i-1].X);
		var dy = (points[i+1].Y - points[i].Y) * (points[i].Y - points[i-1].Y);
		var dn = Distance(points[i+1], points[i]) * Distance(points[i], points[i-1]);
		var cosangle = Math.max(-1.0, Math.min(1.0, (dx + dy) / dn)); // ensure [-1,+1]
		var angle = Math.acos(cosangle) / Math.PI; // normalized angle
		newpoints[newpoints.length] = new Point(points[i].X, points[i].Y, points[i].ID, angle);
	}
	newpoints[newpoints.length] = new Point( // last point
		points[points.length - 1].X,
		points[points.length - 1].Y,
		points[points.length - 1].ID);
	return newpoints;
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
	return new Point(x, y, 0);
}
function PathLength(points) // length traversed by a point path
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++) {
		if (points[i].ID == points[i-1].ID)
			d += Distance(points[i-1], points[i]);
	}
	return d;
}
function DistanceWithAngle(p1, p2) // $P+
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	var da = p2.Angle - p1.Angle;
	return Math.sqrt(dx * dx + dy * dy + da * da);
}
function Distance(p1, p2) // Euclidean distance between two points
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}