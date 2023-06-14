module.exports = {
	Auth: new URL('/auth/', process.env.HOST),
	Index: new URL('/', process.env.HOST),
	Admin: new URL('/admin/', process.env.HOST),
	DB: new URL('/db/', process.env.HOST),
	API: new URL('/api/', process.env.HOST),
};
