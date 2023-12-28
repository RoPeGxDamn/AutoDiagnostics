CREATE OR REPLACE PROCEDURE public.add_service(
	IN vname text,
	IN vdesc text,
	IN vcost numeric)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  INSERT INTO services (name, description, cost)
  VALUES (vname, vdesc, vcost);
END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.change_password(
	IN new_password text,
	IN new_repeat_password text,
	IN uid integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	If new_password = new_repeat_password then
	  UPDATE users SET password = new_password WHERE id = uid;
	    END IF;
END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.decrease_cost(
	IN percent_decrease numeric)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  UPDATE services SET cost = cost - (cost * percent_decrease / 100);
END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.hire(
	IN employee_id integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  DELETE FROM employee WHERE id = employee_id;
END;
$BODY$;

CREATE OR REPLACE PROCEDURE public.increase_cost(
	IN percent_increase numeric)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  UPDATE services SET cost = cost + (cost * percent_increase / 100);
END;
$BODY$;