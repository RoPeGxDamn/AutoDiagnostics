CREATE OR REPLACE FUNCTION public.calculate_average_cost(
	)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  avg_cost NUMERIC;
  total_services INT;
BEGIN
  SELECT COUNT(*) INTO total_services FROM services;
  IF total_services > 0 THEN
    SELECT AVG(cost) into avg_cost FROM services;
  END IF;
  
  RETURN avg_cost;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.find_employee_by_id(
	employee_id integer)
    RETURNS SETOF employees 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$
BEGIN
  RETURN QUERY SELECT * FROM employees WHERE id = employee_id;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.isemailunique(
	em text)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE isUnique BOOLEAN;
BEGIN
		SELECT (count(*) = 0) into isUnique 
		FROM users 
        WHERE email = $1;
		
		RETURN isUnique;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.isphonenumberunique(
	pn text)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE isUnique BOOLEAN;
BEGIN
		SELECT (count(*) = 0) into isUnique 
		FROM users 
        WHERE phone_number = $1;
		
		RETURN isUnique;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.isusernameunique(
	un text)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE isUnique BOOLEAN;
BEGIN
		SELECT (count(*) = 0) into isUnique 
		FROM users 
        WHERE username = $1;
		
		RETURN isUnique;
END;
$BODY$;