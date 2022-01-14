/** @typedef {{ x: Number, y: Number }} Vector */
/** @typedef {{ pos: Vector, vect: Vector, type: String }} Orb */

const orbs = {
	list: [],

	new(x,y, vx,vy, type) {
		this.list.push({
			pos: Jel.nv(x,y),
			vect: Jel.nv(vx,vy),
			type: type,
		});
	},
	update(i) {
		// The orb in question
		/** @type Orb */
		const orb = this.list[i];

		// Check collisions
		if (orb.pos.x + 10 >= Jel.w) {
			orb.pos.x = Jel.w - 10;
			orb.vect.x = Math.abs(orb.vect.x) * -1;
		} else if (orb.pos.x - 10 <= 0) {
			orb.pos.x = 10;
			orb.vect.x = Math.abs(orb.vect.x);
		}

		// Hitting a platform 
		if (orb.pos.y + 10 >= Jel.h * 0.75) {
			orb.pos.y = Jel.h * 0.75 - 10;
			orb.vect.y = Math.abs(orb.vect.y) * -1;
			// if type == "ichor": add to platform's extra dmg 
			// platforms.extra_dmg += orb_info.ichor.bonus_dmg;
		} else if (orb.pos.y - 10 <= 0) {
			orb.pos.y = 10;
			orb.vect.y = Math.abs(orb.vect.y);
		}

		// Update position
		orb.pos.x += orb.vect.x;
		orb.pos.y += orb.vect.y;
	},
	update_all() {
		for (let i = 0; i < this.list.length; i++) 
			this.update(i);
	},
	draw(i) {
		const orb = this.list[i];

		Jel.circle2(orb.pos, 10);
	},
	draw_all() {
		for (let i = 0; i < this.list.length; i++) 
			this.draw(i);
	}
};

const orb_info = {
	basic: {
		dmg: 1,
		min_speed: 4,
	},
	ichor: {
		dmg: 1,
		min_speed: 2,
		bonus_dmg: 5,
	}
};

const platforms = {
	height: Jel.h / 4,
	health: 100,
	extra_dmg: 0, // 0% extra damage, increases with Ichor collisions

	draw() {
		Jel.rect1(
			10, Jel.h - this.height,
			Jel.w - 20, 40
		)
	},
	hit(dmg) {
		// take dmg away from health
		// give cash per dmg

		// if health <= 0: create new platform
		// bonus cash when removing a platform
	},
	new_platform() {
		// create a new platform and refresh health
	}
};

orbs.new(0,0, 5,5, "basic");
orbs.new(0,0, 7,5, "basic");
orbs.new(0,0, 3,7, "basic");
orbs.new(0,0, 1,10, "basic");
orbs.new(0,0, 4,8, "basic");

Jel.run((t)=>{
	Jel.clear();
	
	orbs.update_all();
	orbs.draw_all();
	platforms.draw();
});