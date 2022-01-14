//#region | Canvas Setup
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d", { alpha: false, antialias: false, desynchronize: true });

ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;

canvas.style.position = "absolute";
//#endregion

class KeyEvent {
	constructor(key, on_down = () => { }, on_up = () => { }) {
		/** @type String */
		this.key = key;
		/** @type Boolean */
		this.down = false;
		/** @type Function */
		this.on_down = on_down;
		/** @type Function */
		this.on_up = on_up;
	}
}
class Enum {
	/** @param {String[]} args */
	constructor(...args) {
		this.varients = [].slice.call(args);
		for (let i = 0; i < args.length; i++) this[args[i]] = args[i];
	}
	match(matchi, obj) {
		let called = false;
		for (const k in obj) {
			if (!Object.hasOwnProperty.call(obj, k)) continue;
			const v = obj[k];
			if (matchi != k) continue;
			if (typeof v != "function") {
				console.warn("Enum.match takes an object of functions as it's second argument\nYour passed object: ");
				console.log(obj);
				continue;
			}
			v();
			called = true;
			break;
		}
		if (!called && typeof obj["_"] == "function") obj["_"](matchi);
	}
}
//| Example Enum
// Draw.match( "bababooey", { // Variable matching value
// 	circle() { console.log("circle"); },
// 	square() { console.log("square"); },
// 	none() { console.log("none"); },
// 	_(v) { console.log(`else: ${v}`); }
// });

/** @typedef {{ key: String, down: Boolean }} KeyDown */
const Jel = {
	//#region [> Canvas Things <]
	w: canvas.width,
	h: canvas.height,
	background: "#555",
	clear() {
		ctx.fillStyle = this.background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	},
	//#endregion

	//#region [> Drawing <]
	fill: true,
	fill_color: "white",
	stroke: false,
	line_color: "white",
	line_width: 2,
	rect1(x, y, w, h) {
		x = Math.floor(x); y = Math.floor(y); w = Math.floor(w); h = Math.floor(h);
		if (this.fill) {
			ctx.fillStyle = this.fill_color;
			ctx.fillRect(x, y, w, h);
		}
		if (this.stroke) {
			ctx.strokeStyle = this.fill_color;
			ctx.lineWidth = this.line_width;
			ctx.strokeRect(x, y, w, h);
		}
	},
	rect2(pos, w, h) {
		pos.x = Math.floor(pos.x); pos.y = Math.floor(pos.y); w = Math.floor(w); h = Math.floor(h);
		if (this.fill) {
			ctx.fillStyle = this.fill_color;
			ctx.fillRect(pos.x, pos.y, w, h);
		}
		if (this.stroke) {
			ctx.strokeStyle = this.fill_color;
			ctx.lineWidth = this.line_width;
			ctx.strokeRect(pos.x, pos.y, w, h);
		}
	},
	circle1(x, y, r) {
		x = Math.floor(x); y = Math.floor(y); r = Math.floor(r);
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		if (this.fill) {
			ctx.fillStyle = Jel.fill_color;
			ctx.fill();
		}
		if (this.stroke) {
			ctx.strokeStyle = Jel.line_color;
			ctx.lineWidth = this.line_width;
			ctx.stroke();
		}
	},
	circle2(pos, r) {
		pos = {...pos};
		pos.x = Math.floor(pos.x); pos.y = Math.floor(pos.y); r = Math.floor(r);
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
		if (this.fill) {
			ctx.fillStyle = Jel.fill_color;
			ctx.fill();
		}
		if (this.stroke) {
			ctx.strokeStyle = Jel.line_color;
			ctx.lineWidth = this.line_width;
			ctx.stroke();
		}
	},
	line1(x1, y1, x2, y2) {
		x1 = Math.floor(x1); y1 = Math.floor(y1); x2 = Math.floor(x2); y2 = Math.floor(y2);
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = this.line_color;
		ctx.lineWidth = this.line_width;
		ctx.stroke();
	},
	line2(pos1, pos2) {
		pos1 = {...pos1}; pos2 = {...pos2};
		pos1.x = Math.floor(pos1.x); pos1.y = Math.floor(pos1.y); pos2.x = Math.floor(pos2.x); pos2.y = Math.floor(pos2.y);
		ctx.beginPath();
		ctx.moveTo(pos1.x, pos1.y);
		ctx.lineTo(pos2.x, pos2.y);
		ctx.strokeStyle = this.line_color;
		ctx.lineWidth = this.line_width;
		ctx.stroke();
	},
	path(...pos) {
		if (pos.length == 1 && Array.isArray(pos[0])) pos = pos[0];
		ctx.beginPath();
		ctx.moveTo(Math.floor(pos[0].x), Math.floor(pos[0].y));
		for (let i = 0; i < pos.length; i++) {
			const p = pos[i];
			ctx.lineTo(Math.floor(p.x), Math.floor(p.y));
		}
		ctx.strokeStyle = this.line_color;
		ctx.lineWidth = this.line_width;
		ctx.fillStyle = this.fill_color;
		if (this.fill) ctx.fill();
		else ctx.stroke();
	},
	path_list(...points) {
		const pos = [];
		for (let i = 0; i < points.length; i += 2) {
			const x = points[i];
			const y = points[i+1];
			pos.push(this.nv(Math.floor(x), Math.floor(y)));
		}
		this.path(pos);
	}, 
	polygon(x, y, sides, r) {
			x = Math.floor(x); y = Math.floor(y);
			ctx.beginPath();
			const a = (Math.PI*2)/(sides);
			ctx.moveTo(x + Math.cos(0)*r, y + Math.sin(0)*r);
			for (let i = 0; i < sides; i++) {
				const px = x + Math.cos(i*a)*r;
				const py = y + Math.sin(i*a)*r;
				// console.log(`${Math.round(px*10)/10}, ${Math.round(py*10)/10}`);
				ctx.lineTo( px, py );
			}
			ctx.closePath();
			ctx.fillStyle = this.fill_color;
			ctx.strokeStyle = this.line_color;
			ctx.lineWidth = this.line_width;
			if (this.fill) ctx.fill();
			else if (this.stroke) ctx.stroke();
	},
	//#endregion

	//#region [> Update Functions <]
	pause_key: " ",
	/** @type KeyEvent[] */
	key_events: [],
	key_down(key) {
		for (let i = 0; i < this.key_events.length; i++) {
			const ke = this.key_events[i];
			if (ke.key == key) return ke.down;
		}; this.key_events.push(new KeyEvent(key, ()=>{}));
		return false;
	},
	on_key_down(key, func) {
		for (let i = 0; i < this.key_events.length; i++) {
			const ke = this.key_events[i];
			if (ke.key == key) {
				ke.on_down = func;
				return;
			}
		}; this.key_events.push(new KeyEvent(key, func));
	},
	on_key_up(key, func) {
		for (let i = 0; i < this.key_events.length; i++) {
			const ke = this.key_events[i];
			if (ke.key == key) {
				ke.on_up = func;
				return;
			}
		}; this.key_events.push(new KeyEvent(key, () => { }, func));
	},
	mouse: {
		/** @type Vector */
		pos: null,
		down: false,
		on_click: (e) => { },
		on_down: (e) => { },
		on_up: (e) => { },
	},
	on_resize() { },
	/** @type Function[] */
	runners: [],
	run(func = (t = 0) => { }) { this.runners.push(func) },
	tps: 60,
	tick: 0,
	pause: false,
	step: false,
	update() {
		if (this.step) this.step = false;
		else if (this.pause) return;

		try {
			for (let i = 0; i < this.runners.length; i++) {
				const r = this.runners[i];
				r(this.tick);
			}
		} catch (err) {
			console.log(err);
			this.pause = true;
		}

		if (this.tick >= this.tps)
			this.tick = 0;
		else this.tick++;
	},
	//#endregion

	//#region [> Helper Functions <]
	nv(x, y) {
		return { x: x, y: y };
	},
	angle1(x1, y1, x2, y2) {
		return Math.atan2(y2 - y1, x2 - x1);
	},
	angle2(pos1, pos2) {
		return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
	},
	rand_range(min, max) {
		return Math.floor(Math.random() * max) + min;
	},
	dist1(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
	},
	dist2(pos1, pos2) {
		return Math.sqrt(Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2));
	},
	line_at_angle1(x, y, ang, dist) {
		this.line1(x, y, x + Math.cos(ang) * dist, y + Math.sin(ang) * dist);
	},
	line_at_angle2(pos, ang, dist) {
		this.line1(pos.x, pos.y, pos.x + Math.cos(ang) * dist, pos.y + Math.sin(ang) * dist);
	},
	vect_to_angle(vect) {
		return this.nv(Math.cos(vect.x), Math.sin(vect.y));
	},
	pos_angle(a) { // Positivify angle
		a %= Math.PI * 2;
		if (a < 0) return a + Math.PI * 2;
		return a;
	},
	//#endregion

};

const run_loop = setInterval(()=> Jel.update(), 1000/Jel.tps);

//#region | DOM Events
let is_mobile = false;
window.onresize = () => {
	const h = window.innerHeight;
	const w = window.innerWidth;

	if (w < 300 || h < 250) return;
	
	let sw = w;
	let sh = h;

	if (sw <= 700 && sw < sh) { // On Mobile
		// take up whole screen
		is_mobile = true;
	} else { // On Desktop
		// take up column on the right
		sw = 500;
		is_mobile = false;
	}
	
	canvas.style.width = sw + "px";
	canvas.style.height = sh + "px";
	canvas.width = sw;
	canvas.height = sh;
	Jel.w = canvas.width;
	Jel.h = canvas.height;
	
	Jel.clear();
	for (let i = 0; i < Jel.runners.length; i++) {
		const r = Jel.runners[i];
		r(Jel.tick);
	}

	Jel.on_resize();
}; window.onresize();

document.onkeydown = (e) => {
	const k = e.key;
	if (typeof Jel.pause_key == "string" && k == Jel.pause_key) Jel.pause = !Jel.pause;
	if (k == "z") Jel.step = true;

	for (let i = 0; i < Jel.key_events.length; i++) {
		const ke = Jel.key_events[i];
		if (ke.key == k && ke.down == false) {
			if (typeof ke.on_down == "function") ke.on_down();
			else console.warn("KeyEvent.on_down must be of type 'function'");
			ke.down = true;
			return;
		}
	};
}
document.onkeyup = (e) => {
	const k = e.key;

	for (let i = 0; i < Jel.key_events.length; i++) {
		const ke = Jel.key_events[i];
		if (ke.key == k) {
			if (typeof ke.on_up == "function") ke.on_up();
			else console.warn("KeyEvent.on_up must be of type 'function'");
			ke.down = false;
			return;
		}
	};
}
/** @param {MouseEvent} e */
canvas.onmousemove = (e) => {
	Jel.mouse.pos = Jel.nv(e.clientX, e.clientY);
}
canvas.onmousedown = (e) => {
	Jel.mouse.down = true;
	Jel.mouse.on_click(e);
	Jel.mouse.on_down(e);
}
canvas.onmouseup = (e) => {
	Jel.mouse.down = false;
	Jel.mouse.on_up(e);
}
//#endregion