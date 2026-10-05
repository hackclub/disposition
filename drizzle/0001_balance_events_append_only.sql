CREATE OR REPLACE FUNCTION balance_events_append_only() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
	RAISE EXCEPTION 'balance_events is append-only';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER balance_events_before_update_delete
BEFORE UPDATE OR DELETE ON balance_events
FOR EACH ROW EXECUTE FUNCTION balance_events_append_only();
