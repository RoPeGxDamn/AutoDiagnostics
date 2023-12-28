CREATE OR REPLACE FUNCTION public.check_service()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
  IF NEW.cost < 0 THEN
    RAISE EXCEPTION 'Value must be greater than 0';
  END IF;
  RETURN NEW;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.check_unique_users_requests()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM requests
    WHERE vehicle_id = NEW.vehicle_id
      AND order_date = NEW.order_date
	  AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'User already send request! Try next day!';
  END IF;
  
  RETURN NEW;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.check_user()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
  IF NEW.phone_number not like '+375%' THEN
    RAISE EXCEPTION 'Phone number is invalid';
  END IF;
  
  IF LENGTH(NEW.password) < 6 THEN
    RAISE EXCEPTION 'Password must be longer';
  END IF;
  
  RETURN NEW;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.log_changes()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO changes_log (table_name, row_id, action, changed_data)
        VALUES (TG_TABLE_NAME, NEW.id, 'insert', to_jsonb(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO changes_log (table_name, row_id, action, changed_data)
        VALUES (TG_TABLE_NAME, NEW.id, 'update', to_jsonb(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO changes_log (table_name, row_id, action, changed_data)
        VALUES (TG_TABLE_NAME, OLD.id, 'delete', to_jsonb(OLD));
    END IF;
    RETURN NULL;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.set_accepted_state()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	update requests
	set state = 'accepted'
	where id = NEW.request_id;
	
	RETURN NEW;
END;
$BODY$;

CREATE OR REPLACE FUNCTION public.set_completed_state()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
	update requests
	set state = 'completed'
	where id = NEW.request_id;
	
	RETURN NEW;
END;
$BODY$;