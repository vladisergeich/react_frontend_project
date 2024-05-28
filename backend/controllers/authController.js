class AuthController {
	static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).send({ message: 'Не переданы обязательные поля' });
                return;
            }
            // fake auth
            const row = {id: 1212, email: email};
            res.status(200).send(row);
        } catch (e) {
            res.status(500).send(e.message);
        }
	}

	static async register(req, res) {
        try {
            const { email, password , confirm } = req.body;
            if (!email || !password || !confirm) {
                res.status(400).send({ message: 'Не переданы обязательные поля' });
                return;
            }
            if (password !== confirm) {
                res.status(400).send({ message: 'Пароль не совпадает с подтверждением пароля' });
                return;
            }
            // fake register
            const row = {id: '1212', email: email};
            res.status(200).send(row);
        } catch (e) {
            res.status(500).send(e.message);
        }
	}
}

module.exports = {AuthController}
