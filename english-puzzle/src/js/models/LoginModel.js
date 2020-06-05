import Model from '../base/Model';

export default class LoginModel extends Model {
	constructor(config, apiConfig) {
		super();
		this.config = config;
		this.apiConfig = apiConfig;
		this.email = null;
		this.pass = null;
		this._errors = {};
	}

	load(email, pass) {
		this.email = email;
		this.pass = pass;
		return true;
	}

	validate(callback) {
		this.clearErrors();
		if (!this.config.regExp.email.test(this.email)) {
			this._errors.email = this.config.errors.email;
		}

		if (!this.config.regExp.pass.test(this.pass)) {
			this._errors.pass = this.config.errors.pass;
		}
		callback(this.getErrors());
		return (Object.keys(this._errors).length === 0) ? true : false;
	}

	async loginUser(user, loginHandler) {
		const {
			url, // ссылка
			defaultHeaders: headers, // заголовки
			loginPage: { login: { action, method } } // деструктурируем экшн и метод
		} = this.apiConfig.backendApi;

		try {
			const rawResponse = await fetch(`${url}${action}`, {
				method: method,
				headers: headers,
				body: JSON.stringify(user)
			});
			if (rawResponse.status !== 200) {
				loginHandler('Email or password is incorrect');
				return null;
			}
			const content = await rawResponse.json();
			loginHandler('');
			return content;
		} catch (e) {
			loginHandler('The auth server is unavailable');
			return null;
		}
	}

	async createUser(user, registerHandler) {
		const {
			url, // ссылка
			defaultHeaders: headers, // заголовки
			loginPage: { register: { action, method } } // деструктурируем экшн и метод
		} = this.apiConfig.backendApi;

		try {
			const rawResponse = await fetch(`${url}${action}`, {
				method: method,
				headers: headers,
				body: JSON.stringify(user)
			});
			if (rawResponse.status !== 200) {
				registerHandler(`The user "${user.email}" already exists`);
				return null;
			}
			const content = await rawResponse.json();
			registerHandler('');
			return content;
		} catch (e) {
			registerHandler('The register server is unavailable');
			return null;
		}
	}

	getErrors() {
		return this._errors;
	}

	clearErrors() {
		this._errors = {};
	}
}