DROP FUNCTION IF EXISTS check_user_password;

--
CREATE FUNCTION check_user_password(user_name TEXT, passw TEXT) 
RETURNS TABLE (id BIGINT, nick VARCHAR(50)) AS
$$
DECLARE passed BOOLEAN;
BEGIN
	RETURN query
		SELECT u.id, u.nick
		FROM users as u
		WHERE u.nick = user_name AND u.password = crypt(passw, u.password);
END;
$$
LANGUAGE plpgsql;