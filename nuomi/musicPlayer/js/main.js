function Player() {	
	this.myMusic = $('#myMusic').get(0);
	this.index = 0;
	this.volume = 0.3;
	this.musicList = musicList;
	this.control();
	this.play();
	this.voiceControl();
	this.progressControl();
	this.preAndNext();
}
Player.prototype = {
	constructor: Player,
	//暂停、播放控制
	control: function() {
		let self = this;
		$('.button-control .pause').click(function() {
			$(this).hide();
			$('.button-control .play').show();
			self.myMusic.play();
			$('#cover-animation').removeClass('cover-pause');
		});
		$('.button-control .play').click(function() {
			$(this).hide();
			$('.button-control .pause').show();
			self.myMusic.pause();
			$('#cover-animation').addClass('cover-pause');
		});
	},
	//载入歌曲、播放
	play: function() {
		$('.button-control .pause').hide();
		$('.button-control .play').show();
		myMusic.src = this.musicList[this.index].url;
		$('.name').text(this.musicList[this.index].name);
		$('.singer').text(this.musicList[this.index].singer);
		$('.cover-img').get(0).src = this.musicList[this.index].pic;
		myMusic.play();
		myMusic.volume = this.volume;
		if ($('.button-control .play')[0].style.display === 'none') {
			myMusic.pause();
			self.progressControl();			
		}
		//从新开始动画
		if ($('#cover-animation').hasClass('cover-rotate1')) {
			$('#cover-animation').removeClass('cover-rotate1');
			$('#cover-animation').addClass('cover-rotate2');
		} else {
			$('#cover-animation').removeClass('cover-rotate2');
			$('#cover-animation').addClass('cover-rotate1');
		}
	},
	//快进控制
	progressControl: function() {
		let self = this;
		if ($('.button-control .play')[0].style.display === 'none') {
			$('.info .time').text('00:00 / 00:00');			
		}
		//获取点击时的歌曲时间
		$('.progressBar').click(function(e) {
			let scale = self.barChange(this, e, '.progressBar-green');
			myMusic.currentTime = scale * myMusic.duration;			
		});
		//更新时间、播放进度条
		$('#myMusic').on('timeupdate', function() {
			let currentTime = this.currentTime;
			let musicTime = this.duration;
			let scale = currentTime / musicTime;
			let length = $('.progressBar').width();
			let location = scale * length;
			let musicMinute = addZero( Math.floor(musicTime / 60) );
			let musicSecond = addZero( Math.floor(musicTime % 60) );
			let currentMinute = addZero( Math.floor(currentTime / 60) );
			let currentSecond = addZero( Math.floor(currentTime % 60) );			
			if (!isNaN(musicSecond)) {
				$('.progressBar-green').css('width', location + 'px');
				$('.info .time').text(currentMinute + ':' + currentSecond + ' / ' + musicMinute + ':' + musicSecond);
			}			
			if (currentTime === musicTime) {
				self.index++;
				self.index = self.index % self.musicList.length;
				self.play();
			}
			function addZero(s) {
				return s < 10 ? '0' + s : s;
			}	
		})
	},
	//音量控制
	voiceControl: function() {
		let self = this;
		$('.voice-slider').click(function(e) {
			self.volume = self.barChange(this, e, '.voice-slider-red');
			myMusic.volume = self.volume;
		});
	},
	//上一首、下一首
	preAndNext: function() {
		let self = this;
		$('.next').click(function() {
			self.index++;
			self.index = self.index % self.musicList.length;					
			self.play();
		});
		$('.prev').click(function() {
			self.index--;
			if (self.index < 0) {
				self.index = self.musicList.length - 1;
			}
			self.index = self.index % self.musicList.length;			
			self.play();
		})
	},
	//进度条
	barChange: function(that, ele, bar) {
		//总长度
		let length = $(that).width();
		//点击的位置
		let x = ele.pageX;
		//进度条最左边位置
		let barLeft = $(that).offset().left;
		//点击位置离最左侧的距离
		let clickLength = x - barLeft;
		let scale = clickLength / length;
		$(bar).css('width', clickLength + 'px');
		return scale;
	}
}
function init() {
	let player = new Player();
}
init();
