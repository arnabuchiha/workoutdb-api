CREATE OR REPLACE FUNCTION update_workout_muscle_vector()
RETURNS TRIGGER AS $$
DECLARE
    muscle_codes text[];
    activations float8[];
    act_map jsonb;
    i int;
BEGIN
    SELECT array_agg(code ORDER BY code) INTO muscle_codes FROM muscles;

    SELECT jsonb_object_agg(muscle_code, activation)
    INTO act_map
    FROM workout_muscle_activations
    WHERE workout_id = NEW.workout_id;

    activations := ARRAY[]::float8[];
    FOR i IN 1..array_length(muscle_codes, 1) LOOP
        activations := activations || COALESCE((act_map ->> muscle_codes[i])::float8, 0.0);
    END LOOP;

    UPDATE workouts
    SET muscle_vector = activations::vector
    WHERE id = NEW.workout_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;



DROP TRIGGER IF EXISTS workout_muscle_activations_trigger ON workout_muscle_activations;

CREATE TRIGGER workout_muscle_activations_trigger
AFTER INSERT OR UPDATE OR DELETE ON workout_muscle_activations
FOR EACH ROW
EXECUTE FUNCTION update_workout_muscle_vector();

UPDATE workout_muscle_activations
SET activation = activation;