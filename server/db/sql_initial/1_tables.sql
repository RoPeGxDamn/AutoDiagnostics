CREATE TABLE IF NOT EXISTS public.changes_log
(
    id integer NOT NULL DEFAULT nextval('changes_log_id_seq'::regclass),
    table_name character varying(255) COLLATE pg_catalog."default",
    action character varying(10) COLLATE pg_catalog."default",
    changed_data jsonb,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    row_id uuid,
    CONSTRAINT changes_log_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    surname text COLLATE pg_catalog."default",
    name text COLLATE pg_catalog."default",
    patronymic text COLLATE pg_catalog."default",
    phone_number text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default",
    role role_type DEFAULT 'client'::role_type,
    birth_date date,
    username text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_phone_number_key UNIQUE (phone_number)
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER io_user_trigger
    BEFORE INSERT OR UPDATE 
    ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.check_user();
CREATE OR REPLACE TRIGGER users_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.clients
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    vehicle_id uuid,
    CONSTRAINT clients_pkey PRIMARY KEY (id),
    CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT clients_vehicle_id_fkey FOREIGN KEY (vehicle_id)
        REFERENCES public.vehicles (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER clients_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.employees
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    address text COLLATE pg_catalog."default",
    employment_date date,
    specialization text COLLATE pg_catalog."default",
    CONSTRAINT employees_pkey PRIMARY KEY (id),
    CONSTRAINT employees_address_key UNIQUE (address),
    CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER employees_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.vehicles
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    model character varying(100) COLLATE pg_catalog."default",
    year integer,
    vin character varying(17) COLLATE pg_catalog."default",
    CONSTRAINT vehicles_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER vehicles_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.services
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(100) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    cost numeric(10,2),
    CONSTRAINT services_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER insert_constraint_trigger
    BEFORE INSERT OR UPDATE 
    ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.check_service();
CREATE OR REPLACE TRIGGER services_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.days_schedule
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    day_of_week weekday_type,
    start_time time without time zone,
    end_time time without time zone,
    CONSTRAINT days_schedule_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER days_schedule_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.days_schedule
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.employees_schedule
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    days_schedule_id uuid,
    employee_id uuid,
    CONSTRAINT employees_schedule_pkey PRIMARY KEY (id),
    CONSTRAINT employees_schedule_days_schedule_id_fkey FOREIGN KEY (days_schedule_id)
        REFERENCES public.days_schedule (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT employees_schedule_employee_id_fkey FOREIGN KEY (employee_id)
        REFERENCES public.employees (id) MATCH SIMPLE
        ON UPDATE SET NULL
        ON DELETE SET NULL
        NOT VALID
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER employees_schedule_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.employees_schedule
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.requests
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    vehicle_id uuid,
    order_date date,
    state state_type DEFAULT 'process'::state_type,
    CONSTRAINT requests_pkey PRIMARY KEY (id),
    CONSTRAINT requests_vehicle_id_fkey FOREIGN KEY (vehicle_id)
        REFERENCES public.vehicles (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER check_user_requests
    BEFORE INSERT OR UPDATE 
    ON public.requests
    FOR EACH ROW
    EXECUTE FUNCTION public.check_unique_users_requests();
CREATE OR REPLACE TRIGGER requests_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.requests
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.request_services
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    request_id uuid,
    service_id uuid,
    CONSTRAINT request_services_pkey PRIMARY KEY (id),
    CONSTRAINT request_services_request_id_fkey FOREIGN KEY (request_id)
        REFERENCES public.requests (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT request_services_service_id_fkey FOREIGN KEY (service_id)
        REFERENCES public.services (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER after_adding_services
    AFTER INSERT
    ON public.request_services
    FOR EACH ROW
    EXECUTE FUNCTION public.set_accepted_state();
CREATE OR REPLACE TRIGGER request_services_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.request_services
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.results
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    request_id uuid,
    employee_id uuid,
    complete_date date,
    comment text COLLATE pg_catalog."default",
    CONSTRAINT results_pkey PRIMARY KEY (id),
    CONSTRAINT results_employee_id_fkey FOREIGN KEY (employee_id)
        REFERENCES public.employees (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT results_request_id_fkey FOREIGN KEY (request_id)
        REFERENCES public.requests (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER after_creating_order
    AFTER INSERT
    ON public.results
    FOR EACH ROW
    EXECUTE FUNCTION public.set_completed_state();
CREATE OR REPLACE TRIGGER results_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.results
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();


CREATE TABLE IF NOT EXISTS public.feedback
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    request_id uuid,
    client_id uuid,
    rate integer,
    description text COLLATE pg_catalog."default",
    created_at date DEFAULT now(),
    CONSTRAINT feedback_pkey PRIMARY KEY (id),
    CONSTRAINT feedback_client_id_fkey FOREIGN KEY (client_id)
        REFERENCES public.clients (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT feedback_request_id_fkey FOREIGN KEY (request_id)
        REFERENCES public.requests (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)
TABLESPACE pg_default;
CREATE OR REPLACE TRIGGER feedback_changes
    AFTER INSERT OR DELETE OR UPDATE 
    ON public.feedback
    FOR EACH ROW
    EXECUTE FUNCTION public.log_changes();