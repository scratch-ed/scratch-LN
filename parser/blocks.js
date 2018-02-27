let blocks = {};
export default blocks;


blocks["%1 + %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_add", "args":[{"type":"input_value","name":"NUM1"},{"type":"input_value","name":"NUM2"}],"shape":"reporterblock"} ); };
blocks["%1 - %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_subtract", "args":[{"type":"input_value","name":"NUM1"},{"type":"input_value","name":"NUM2"}],"shape":"reporterblock"} ); };
blocks["%1 * %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_multiply", "args":[{"type":"input_value","name":"NUM1"},{"type":"input_value","name":"NUM2"}],"shape":"reporterblock"} ); };
blocks["%1 / %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_divide", "args":[{"type":"input_value","name":"NUM1"},{"type":"input_value","name":"NUM2"}],"shape":"reporterblock"} ); };
blocks["pick random %1 to %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_random", "args":[{"type":"input_value","name":"FROM"},{"type":"input_value","name":"TO"}],"shape":"reporterblock"} ); };
blocks["%1 \\< %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_lt", "args":[{"type":"input_value","name":"OPERAND1"},{"type":"input_value","name":"OPERAND2"}],"shape":"booleanblock"} ); };
blocks["%1 = %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_equals", "args":[{"type":"input_value","name":"OPERAND1"},{"type":"input_value","name":"OPERAND2"}],"shape":"booleanblock"} ); };
blocks["%1 \\> %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_gt", "args":[{"type":"input_value","name":"OPERAND1"},{"type":"input_value","name":"OPERAND2"}],"shape":"booleanblock"} ); };
blocks["%1 and %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_and", "args":[{"type":"input_value","name":"OPERAND1","check":"Boolean"},{"type":"input_value","name":"OPERAND2","check":"Boolean"}],"shape":"booleanblock"} ); };
blocks["%1 or %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_or", "args":[{"type":"input_value","name":"OPERAND1","check":"Boolean"},{"type":"input_value","name":"OPERAND2","check":"Boolean"}],"shape":"booleanblock"} ); };
blocks["not %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_not", "args":[{"type":"input_value","name":"OPERAND","check":"Boolean"}],"shape":"booleanblock"} ); };
blocks["join %1 %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_join", "args":[{"type":"input_value","name":"STRING1"},{"type":"input_value","name":"STRING2"}],"shape":"reporterblock"} ); };
blocks["letter %1 of %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_letter_of", "args":[{"type":"input_value","name":"LETTER"},{"type":"input_value","name":"STRING"}],"shape":"reporterblock"} ); };


blocks["%1 mod %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_mod", "args":[{"type":"input_value","name":"NUM1"},{"type":"input_value","name":"NUM2"}],"shape":"reporterblock"} ); };
blocks["round %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_round", "args":[{"type":"input_value","name":"NUM"}],"shape":"reporterblock"} ); };

blocks["wait %1 seconds"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"control_wait", "args":[{"type":"input_value","name":"DURATION"}],"shape":"statement"} ); };
blocks["wait until %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"control_wait_until", "args":[{"type":"input_value","name":"CONDITION","check":"Boolean"}],"shape":"statement"} ); };
blocks["when I start as a clone"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"control_start_as_clone", "args":[],"shape":"hatblock"} ); };
blocks["create clone of %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"control_create_clone_of", "args":[{"type":"input_value","name":"CLONE_OPTION","menu":"control_create_clone_of_menu"}],"shape":"statement"} ); };
blocks["delete this clone"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"control_delete_this_clone", "args":[],"shape":"capblock"} ); };
blocks["stop %1"] = function (ctx, visitor) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': "control_stop"
    });

    visitor.xml = visitor.xml.ele('field', {
        'name': "STOP_OPTION"
    }, visitor.visit(ctx.argument));

    visitor.xml = visitor.xml.up();
};

blocks["touching %1?"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_touchingobject", "args":[{"type":"input_value","name":"TOUCHINGOBJECTMENU","menu":"sensing_touchingobjectmenu"}],"shape":"booleanblock"} ); };
blocks["touching color %1?"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_touchingcolor", "args":[{"type":"input_value","name":"COLOR"}],"shape":"booleanblock"} ); };
blocks["color %1 is touching %2?"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_coloristouchingcolor", "args":[{"type":"input_value","name":"COLOR"},{"type":"input_value","name":"COLOR2"}],"shape":"booleanblock"} ); };
blocks["distance to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_distanceto", "args":[{"type":"input_value","name":"DISTANCETOMENU","menu":"sensing_distancetomenu"}],"shape":"reporterblock"} ); };
blocks["ask %1 and wait"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_askandwait", "args":[{"type":"input_value","name":"QUESTION"}],"shape":"statement"} ); };
blocks["answer"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_answer","shape":"reporterblock"} ); };
blocks["key %1 pressed?"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_keypressed", "args":[{"type":"field_dropdown","name":"KEY_OPTION","options":[["space","space"],["left arrow","left arrow"],["right arrow","right arrow"],["down arrow","down arrow"],["up arrow","up arrow"],["any","any"],["a","a"],["b","b"],["c","c"],["d","d"],["e","e"],["f","f"],["g","g"],["h","h"],["i","i"],["j","j"],["k","k"],["l","l"],["m","m"],["n","n"],["o","o"],["p","p"],["q","q"],["r","r"],["s","s"],["t","t"],["u","u"],["v","v"],["w","w"],["x","x"],["y","y"],["z","z"],["0","0"],["1","1"],["2","2"],["3","3"],["4","4"],["5","5"],["6","6"],["7","7"],["8","8"],["9","9"]]}],"shape":"booleanblock"} ); };
blocks["mouse down?"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_mousedown","shape":"booleanblock"} ); };
blocks["mouse x"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_mousex","shape":"reporterblock"} ); };
blocks["mouse y"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_mousey","shape":"reporterblock"} ); };
blocks["set drag mode %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_setdragmode", "args":[{"type":"field_dropdown","name":"DRAG_MODE","options":[["draggable","draggable"],["not draggable","not draggable"]]}],"shape":"statement"} ); };
blocks["loudness"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_loudness","shape":"reporterblock"} ); };
blocks["video %1 on %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_videoon", "args":[{"type":"input_value","name":"VIDEOONMENU1"},{"type":"input_value","name":"VIDEOONMENU2"}],"shape":"reporterblock"} ); };
blocks["turn video %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_videotoggle", "args":[{"type":"input_value","name":"VIDEOTOGGLEMENU"}],"shape":"statement"} ); };
blocks["set video transparency to %1%"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_setvideotransparency", "args":[{"type":"input_value","name":"TRANSPARENCY"}],"shape":"statement"} ); };
blocks["timer"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_timer","shape":"reporterblock"} ); };
blocks["reset timer"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_resettimer","shape":"statement"} ); };
blocks["current %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_current", "args":[{"type":"field_dropdown","name":"CURRENTMENU","options":[["year","YEAR"],["month","MONTH"],["date","DATE"],["day of week","DAYOFWEEK"],["hour","HOUR"],["minute","MINUTE"],["second","SECOND"]]}],"shape":"reporterblock"} ); };
blocks["days since 2000"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_dayssince2000","shape":"reporterblock"} ); };
blocks["username"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sensing_username","shape":"reporterblock"} ); };


blocks["move %1 steps"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_movesteps", "args":[{"type":"input_value","name":"STEPS"}],"shape":"statement"} ); };
blocks["turn cw %1 degrees"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_turnright", "args":[{"type":"input_value","name":"DEGREES"}],"shape":"statement"} ); };
blocks["turn right %1 degrees"] = blocks["turn cw %2 degrees"];

blocks["turn ccw %1 degrees"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_turnleft", "args":[{"type":"input_value","name":"DEGREES"}],"shape":"statement"} ); };
blocks["turn left %1 degrees"]=blocks["turn cww %1 degrees"];

blocks["point in direction %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_pointindirection", "args":[{"type":"input_value","name":"DIRECTION"}],"shape":"statement"} ); };
blocks["point towards %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_pointtowards", "args":[{"type":"input_value","name":"TOWARDS","menu":"motion_pointtowards_menu"}],"shape":"statement"} ); };
blocks["go to x: %1 y: %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_gotoxy", "args":[{"type":"input_value","name":"X"},{"type":"input_value","name":"Y"}],"shape":"statement"} ); };

blocks["glide %1 secs to x: %2 y: %3"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_glidesecstoxy", "args":[{"type":"input_value","name":"SECS"},{"type":"input_value","name":"X"},{"type":"input_value","name":"Y"}],"shape":"statement"} ); };
blocks["glide %1 secs to %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_glideto", "args":[{"type":"input_value","name":"SECS"},{"type":"input_value","name":"TO","menu":"motion_glideto_menu"}],"shape":"statement"} ); };
blocks["change x by %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_changexby", "args":[{"type":"input_value","name":"DX"}],"shape":"statement"} ); };
blocks["set x to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_setx", "args":[{"type":"input_value","name":"X"}],"shape":"statement"} ); };
blocks["change y by %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_changeyby", "args":[{"type":"input_value","name":"DY"}],"shape":"statement"} ); };
blocks["set y to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_sety", "args":[{"type":"input_value","name":"Y"}],"shape":"statement"} ); };
//todo: "if"
blocks["if on edge, bounce"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_ifonedgebounce","shape":"statement"} ); };
blocks["set rotation style %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_setrotationstyle", "args":[{"type":"field_dropdown","name":"STYLE","options":[["left-right","left-right"],["don't rotate","don't rotate"],["all around","all around"]]}],"shape":"statement"} ); };
blocks["x position"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_xposition","shape":"reporterblock"} ); };
blocks["y position"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_yposition","shape":"reporterblock"} ); };
blocks["direction"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_direction","shape":"reporterblock"} ); };

blocks["say %1 for %2 seconds"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_sayforsecs", "args":[{"type":"input_value","name":"MESSAGE"},{"type":"input_value","name":"SECS"}],"shape":"statement"} ); };
blocks["say %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_say", "args":[{"type":"input_value","name":"MESSAGE"}],"shape":"statement"} ); };
blocks["think %1 for %2 seconds"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_thinkforsecs", "args":[{"type":"input_value","name":"MESSAGE"},{"type":"input_value","name":"SECS"}],"shape":"statement"} ); };
blocks["think %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_think", "args":[{"type":"input_value","name":"MESSAGE"}],"shape":"statement"} ); };
blocks["show"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_show","shape":"statement"} ); };
blocks["hide"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_hide","shape":"statement"} ); };
blocks["clear graphic effects"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_cleargraphiceffects","shape":"statement"} ); };
blocks["change size by %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_changesizeby", "args":[{"type":"input_value","name":"CHANGE"}],"shape":"statement"} ); };
blocks["set size to %1 %"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_setsizeto", "args":[{"type":"input_value","name":"SIZE"}],"shape":"statement"} ); };
blocks["size"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_size","shape":"reporterblock"} ); };
blocks["switch costume to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_switchcostumeto", "args":[{"type":"input_value","name":"COSTUME","menu":"looks_costume"}],"shape":"statement"} ); };
blocks["next costume"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_nextcostume","shape":"statement"} ); };
blocks["switch backdrop to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_switchbackdropto", "args":[{"type":"input_value","name":"BACKDROP","menu":"looks_backdrops"}],"shape":"statement"} ); };
blocks["go %1 %2 layers"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_goforwardbackwardlayers", "args":[{"type":"field_dropdown","name":"FORWARD_BACKWARD","options":[["forward","forward"],["backward","backward"]]},{"type":"input_value","name":"NUM"}],"shape":"statement"} ); };
blocks["backdrop %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_backdropnumbername", "args":[{"type":"field_dropdown","name":"NUMBER_NAME","options":[["number","number"],["name","name"]]}],"shape":"reporterblock"} ); };
blocks["costume %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_costumenumbername", "args":[{"type":"field_dropdown","name":"NUMBER_NAME","options":[["number","number"],["name","name"]]}],"shape":"reporterblock"} ); };
blocks["switch backdrop to %1 and wait"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_switchbackdroptoandwait", "args":[{"type":"input_value","name":"BACKDROP","menu":"looks_backdrops"}],"shape":"statement"} ); };
blocks["next backdrop"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_nextbackdrop","shape":"statement"} ); };

blocks["clear"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_clear","shape":"statement"} ); };
blocks["stamp"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_stamp","shape":"statement"} ); };
//blocks["pen down"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_pendown","shape":"statement"} ); };
blocks["pen up"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_penup","shape":"statement"} ); };
blocks["set pen color to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_setpencolortocolor", "args":[{"type":"input_value","name":"COLOR"}],"shape":"statement"} ); };
blocks["change pen color by %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_changepencolorby", "args":[{"type":"input_value","name":"COLOR"}],"shape":"statement"} ); };
blocks["set pen color to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_setpencolortonum", "args":[{"type":"input_value","name":"COLOR"}],"shape":"statement"} ); };
blocks["change pen shade by %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_changepenshadeby", "args":[{"type":"input_value","name":"SHADE"}],"shape":"statement"} ); };
blocks["set pen shade to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_setpenshadeto", "args":[{"type":"input_value","name":"SHADE"}],"shape":"statement"} ); };
blocks["change pen size by %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_changepensizeby", "args":[{"type":"input_value","name":"SIZE"}],"shape":"statement"} ); };
blocks["set pen size to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_setpensizeto", "args":[{"type":"input_value","name":"SIZE"}],"shape":"statement"} ); };
blocks["change pen transparency by %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_changepentransparencyby", "args":[{"type":"input_value","name":"TRANSPARENCY"}],"shape":"statement"} ); };
blocks["set pen transparency to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"pen_setpentransparencyto", "args":[{"type":"input_value","name":"TRANSPARENCY"}],"shape":"statement"} ); };

blocks["start sound %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_play", "args":[{"type":"input_value","name":"SOUND_MENU","menu":"sound_sounds_menu"}],"shape":"statement"} ); };
blocks["play sound %1 until done"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_playuntildone", "args":[{"type":"input_value","name":"SOUND_MENU","menu":"sound_sounds_menu"}],"shape":"statement"} ); };
blocks["stop all sounds"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_stopallsounds","shape":"statement"} ); };
blocks["play drum %1 for %2 beats"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_playdrumforbeats", "args":[{"type":"input_value","name":"DRUM","menu":"sound_drums_menu"},{"type":"input_value","name":"BEATS"}],"shape":"statement"} ); };
blocks["rest for %1 beats"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_restforbeats", "args":[{"type":"input_value","name":"BEATS"}],"shape":"statement"} ); };
blocks["play note %1 for %2 beats"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_playnoteforbeats", "args":[{"type":"input_value","name":"NOTE"},{"type":"input_value","name":"BEATS"}],"shape":"statement"} ); };
blocks["clear sound effects"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_cleareffects","shape":"statement"} ); };
blocks["set instrument to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_setinstrumentto", "args":[{"type":"input_value","name":"INSTRUMENT","menu":"sound_instruments_menu"}],"shape":"statement"} ); };
blocks["change volume by %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_changevolumeby", "args":[{"type":"input_value","name":"VOLUME"}],"shape":"statement"} ); };
blocks["set volume to %1 %"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_setvolumeto", "args":[{"type":"input_value","name":"VOLUME"}],"shape":"statement"} ); };
blocks["volume"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_volume","shape":"reporterblock"} ); };
blocks["change tempo by %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_changetempoby", "args":[{"type":"input_value","name":"TEMPO"}],"shape":"statement"} ); };
blocks["set tempo to %1 bpm"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_settempotobpm", "args":[{"type":"input_value","name":"TEMPO"}],"shape":"statement"} ); };
blocks["tempo"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_tempo","shape":"reporterblock"} ); };

blocks["when gf clicked"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"event_whenflagclicked", "args":[],"shape":"hatblock"} ); };
blocks["when greenflag clicked"]=blocks["when gf clicked"];
blocks["when this sprite clicked"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"event_whenthisspriteclicked","shape":"hatblock"} ); };

blocks["when backdrop switches to %1"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"event_whenbackdropswitchesto", "args":[{"type":"field_dropdown","name":"BACKDROP","options":[["backdrop1","BACKDROP1"]]}],"shape":"hatblock"} ); };
blocks["when %1 \\> %2"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"event_whengreaterthan", "args":[{"type":"field_dropdown","name":"WHENGREATERTHANMENU","options":[["timer","TIMER"]]},{"type":"input_value","name":"VALUE"}],"shape":"hatblock"} ); };
blocks["when %1 key pressed"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"event_whenkeypressed", "args":[{"type":"field_dropdown","name":"KEY_OPTION","options":[["space","space"],["left arrow","left arrow"],["right arrow","right arrow"],["down arrow","down arrow"],["up arrow","up arrow"],["any","any"],["a","a"],["b","b"],["c","c"],["d","d"],["e","e"],["f","f"],["g","g"],["h","h"],["i","i"],["j","j"],["k","k"],["l","l"],["m","m"],["n","n"],["o","o"],["p","p"],["q","q"],["r","r"],["s","s"],["t","t"],["u","u"],["v","v"],["w","w"],["x","x"],["y","y"],["z","z"],["0","0"],["1","1"],["2","2"],["3","3"],["4","4"],["5","5"],["6","6"],["7","7"],["8","8"],["9","9"]]}],"shape":"hatblock"} ); };


// blocks["%1 %2 pen down"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"extension_pen_down", "args":[{"type":"field_image","src":"/static/blocks-media/extensions/pen-block-icon.svg","width":40,"height":40},{"type":"field_vertical_separator"}],"shape":"statement"} ); }
// blocks["%1 %2 play drum %3"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"extension_music_drum", "args":[{"type":"field_image","src":"/static/blocks-media/extensions/music-block-icon.svg","width":40,"height":40},{"type":"field_vertical_separator"},{"type":"input_value","name":"NUMBER"}],"shape":"statement"} ); }
// blocks["%1 %2 turn a motor %3"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"extension_wedo_motor", "args":[{"type":"field_image","src":"/static/blocks-media/extensions/wedo2-block-icon.svg","width":40,"height":40},{"type":"field_vertical_separator"},{"type":"field_image","src":"/static/blocks-media/rotate-right.svg","width":24,"height":24}],"shape":"statement"} ); }
// blocks["%1 %2 when I am wearing a hat"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"extension_wedo_hat", "args":[{"type":"field_image","src":"/static/blocks-media/extensions/wedo2-block-icon.svg","width":40,"height":40},{"type":"field_vertical_separator"}],"shape":"hatblock"} ); }
// blocks["%1 %2 O RLY?"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"extension_wedo_boolean", "args":[{"type":"field_image","src":"/static/blocks-media/extensions/wedo2-block-icon.svg","width":40,"height":40},{"type":"field_vertical_separator"}],"shape":"booleanblock"} ); }
// blocks["%1 %2 tilt angle %3"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"extension_wedo_tilt_reporter", "args":[{"type":"field_image","src":"/static/blocks-media/extensions/wedo2-block-icon.svg","width":40,"height":40},{"type":"field_vertical_separator"},{"type":"input_value","name":"TILT"}],"shape":"reporterblock"} ); }
// blocks["%1 %2 hey now, you're an all-star"]=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"extension_music_reporter", "args":[{"type":"field_image","src":"/static/blocks-media/extensions/music-block-icon.svg","width":40,"height":40},{"type":"field_vertical_separator"}],"shape":"reporterblock"} ); }





export function universalBlockConverter(ctx, visitor, structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': structure.type
    });
    for (let i = 0; i < ctx.argument.length; i++) {
        let arg = structure.args[i];
        if (arg.menu) {

            visitor.xml = visitor.xml.ele('value', {
                'name': arg.name
            });
            visitor.xml.ele('shadow', {
                'type': arg.menu //this was added to the json and was not default.
            }).ele('field', {
                'name': arg.name
            }, visitor.visit(ctx.argument[i])); // '_mouse_'
            visitor.xml = visitor.xml.up();
        } else if (arg.type === 'input_value') {

            visitor.xml = visitor.xml.ele('value', {
                'name': arg.name
            });
            visitor.visit(ctx.argument[i]);
            visitor.xml = visitor.xml.up();

        } else if (arg.type === 'field_dropdown') {
            visitor.xml = visitor.xml.ele('field', {
                'name': arg.name
            }, visitor.visit(ctx.argument[i])); //'all around' //this is ugly because 'option' is the only one that returns something... and there is no check whether the option is existing and valid
            visitor.xml = visitor.xml.up();
        }
    }

}

//=======================================================================================================================================
// variable and list operations require special treatment considering the IDS
//=======================================================================================================================================

blocks["set %1 to %2"]=function(ctx,visitor){return variableBlockConverter(ctx, visitor, { "type":"data_setvariableto", "args":[{"type":"field_variable","name":"variable"},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };
blocks["change %1 by %2"]=function(ctx,visitor){return variableBlockConverter(ctx, visitor, { "type":"data_changevariableby", "args":[{"type":"field_variable","name":"variable"},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };

blocks["add %1 to %2"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_addtolist", "args":[{"type":"input_value","name":"ITEM"},{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };
blocks["delete %1 of %2"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_deleteoflist", "args":[{"type":"input_value","name":"INDEX"},{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };
blocks["insert %1 at %2 of %3"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_insertatlist", "args":[{"type":"input_value","name":"ITEM"},{"type":"input_value","name":"INDEX"},{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };
blocks["replace item %1 of %2 with %3"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_replaceitemoflist", "args":[{"type":"input_value","name":"INDEX"},{"type":"field_variable","name":"LIST","variabletypes":["list"]},{"type":"input_value","name":"ITEM"}],"shape":"statement"} ); };
blocks["item %1 of %2"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_itemoflist", "args":[{"type":"input_value","name":"INDEX"},{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"booleans"} ); };
blocks["show list %1"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_showlist", "args":[{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };
blocks["hide list %1"]=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_hidelist", "args":[{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"statement"} ); };

function variableBlockConverter(ctx, visitor, structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
    });
    visitor.xml.att('type', structure.type);
    let varble = visitor.visit(ctx.argument[0]);
    visitor.getVariableID(varble);
    visitor.xml = visitor.xml.ele('field', {
        'name': 'VARIABLE'
    }, varble);
    visitor.xml = visitor.xml.up().ele('value', {
        'name': 'VALUE'
    });
    visitor.visit(ctx.argument[1]);
    visitor.xml = visitor.xml.up();
}

function listBlockConverter(ctx, visitor, structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': structure.type
    });
    for (let i = 0; i < ctx.argument.length; i++) {
        let arg = structure.args[i];
        if (arg.name === 'LIST') {
            let varble = visitor.visit(ctx.argument[i]);
            visitor.getVariableID(varble, 'list');
            visitor.xml = visitor.xml.ele('field', {
                'name': 'LIST',
                'variabletype': 'list',
            }, varble);
            visitor.xml = visitor.xml.up();
        } else if (arg.type === 'input_value') {
            visitor.xml = visitor.xml.ele('value', {
                'name': arg.name
            });
            visitor.visit(ctx.argument[i]);
            visitor.xml = visitor.xml.up();
        } else if (arg.type === 'field_dropdown') {
            visitor.xml = visitor.xml.ele('field', {
                'name': arg.name
            }, visitor.visit(ctx.argument[i])); //'all around' //this is ugly because 'menu' is the only one that returns something... and there is no check whether the option is existing and valid
            visitor.xml = visitor.xml.up();
        }
    }
}

blocks["when I receive %1"]=function(ctx,visitor){return messageBlockconverter(ctx, visitor, { "type":"event_whenbroadcastreceived", "args":[{"type":"field_variable","name":"BROADCAST_OPTION","variabletypes":["broadcast_msg"],"variable":"message1"}],"shape":"hatblock"} ); };
blocks["broadcast %1"]=function(ctx,visitor){return messageShadowBlockconverter(ctx, visitor, { "type":"event_broadcast", "args":[{"type":"input_value","name":"BROADCAST_INPUT"}],"shape":"statement"} ); };
blocks["broadcast %1 and wait"]=function(ctx,visitor){return messageShadowBlockconverter(ctx, visitor, { "type":"event_broadcastandwait", "args":[{"type":"input_value","name":"BROADCAST_INPUT"}],"shape":"statement"} ); };

function messageShadowBlockconverter(ctx, visitor,structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': structure.type
    });

    let varble = visitor.visit(ctx.argument[0]);
    let arg = structure.args[0];
    let id = visitor.getVariableID(varble, 'broadcast_msg');

    visitor.xml = visitor.xml.ele('value', {
        'name': arg.name
    });
    visitor.xml.ele('shadow', {
        'type': "event_broadcast_menu"
    }).ele('field', {
        'name': 'BROADCAST_OPTION',
        'variabletype':"broadcast_msg",
        'id':id
    }, varble);
    visitor.xml = visitor.xml.up();
}

function messageBlockconverter(ctx, visitor,structure) {
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': structure.type
    });

    let varble = visitor.visit(ctx.argument[0]);
    let arg = structure.args[0];
    let id = visitor.getVariableID(varble, 'broadcast_msg');

    visitor.xml.ele('field', {
        'name': "BROADCAST_OPTION",
        'variabletype':"broadcast_msg",
        'id':id
    }, varble);

}

//=======================================================================================================================================
// if the same text on the block: do smart
//=======================================================================================================================================


let lookSetEffect=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_seteffectto", "args":[{"type":"field_dropdown","name":"EFFECT","options":[["color","COLOR"],["fisheye","FISHEYE"],["whirl","WHIRL"],["pixelate","PIXELATE"],["mosaic","MOSAIC"],["brightness","BRIGHTNESS"],["ghost","GHOST"]]},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };
let soundSetEffect=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_seteffectto", "args":[{"type":"field_dropdown","name":"EFFECT","options":[["pitch","PITCH"],["pan left/right","PAN"]]},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };
blocks["set %1 effect to %2"] = function(ctx, visitor) {
    let opt = visitor.getString(ctx.option[0]);
    if (opt === 'sound') {
        return soundSetEffect(ctx, visitor);
    }
   	let label = visitor.getString(ctx.argument[0]);
    if (label === "pan left/right" || label ==='pitch' ){
    	return soundSetEffect(ctx, visitor);
    }
    return lookSetEffect(ctx, visitor);
};

let soundChangeEffect=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"sound_changeeffectby", "args":[{"type":"field_dropdown","name":"EFFECT","options":[["pitch","PITCH"],["pan left/right","PAN"]]},{"type":"input_value","name":"VALUE"}],"shape":"statement"} ); };
let lookChangeEffect=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_changeeffectby", "args":[{"type":"field_dropdown","name":"EFFECT","options":[["color","COLOR"],["fisheye","FISHEYE"],["whirl","WHIRL"],["pixelate","PIXELATE"],["mosaic","MOSAIC"],["brightness","BRIGHTNESS"],["ghost","GHOST"]]},{"type":"input_value","name":"CHANGE"}],"shape":"statement"} ); };
blocks["change %1 effect by %2"] = function(ctx, visitor) {
    let opt = visitor.getString(ctx.option[0]);
    let label = visitor.getString(ctx.argument[0]);
    if (opt === 'sound') {
        return soundChangeEffect(ctx, visitor);
    }
    if (label === "pan left/right" || label ==='pitch' ){
    	return soundChangeEffect(ctx, visitor);
    }

    return lookChangeEffect(ctx, visitor);
};

let operatorOf=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_mathop", "args":[{"type":"field_dropdown","name":"OPERATOR","options":[["abs","abs"],["floor","floor"],["ceiling","ceiling"],["sqrt","sqrt"],["sin","sin"],["cos","cos"],["tan","tan"],["asin","asin"],["acos","acos"],["atan","atan"],["ln","ln"],["log","log"],["e ^","e ^"],["10 ^","10 ^"]]},{"type":"input_value","name":"NUM"}],"shape":"reporterblock"} ); };
let sensingOf = function (ctx, visitor) {
    //return universalBlockConverter(ctx, visitor, { "type":"sensing_of", "args":[{"type":"field_dropdown","name":"PROPERTY","options":[["x position","x position"],["y position","y position"],["direction","direction"],["costume #","costume #"],["costume name","costume name"],["size","size"],["volume","volume"],["backdrop #","backdrop #"],["backdrop name","backdrop name"]],'menu':'sensing_of_object_menu'},{"type":"input_value","name":"OBJECT"}],"shape":"booleans"} ); 
    //something was weird here...
    visitor.xml = visitor.xml.ele('block', {
        'id': visitor.getNextId(),
        'type': 'sensing_of'
    });
    visitor.xml = visitor.xml.ele('field', {
        'name': 'PROPERTY'
    }, visitor.visit(ctx.argument[0])); //'all around' //this is ugly because 'option' is the only one that returns something... and there is no check whether the option is existing and valid
    visitor.xml = visitor.xml.up().ele('value', {
        'name': 'OBJECT'
    });
    //no assignement bcs of visist
    visitor.xml.ele('shadow', {
        'type': 'sensing_of_object_menu' //this was added to the json and was not default.
    }).ele('field', {
        'name': 'OBJECT'
    }, visitor.visit(ctx.argument[1])); // '_mouse_'
    visitor.xml = visitor.xml.up();
};

blocks["%1 of %2"] = function(ctx, visitor) {
    let argType = visitor.getType(ctx.argument[1]);
    if (argType === 'choice') {
        return sensingOf(ctx, visitor);
    }
    return operatorOf(ctx, visitor);
};

let operatorContains=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_contains", "args":[{"type":"input_value","name":"STRING1"},{"type":"input_value","name":"STRING2"}],"shape":"booleanblock"} ); };
let listContains=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_listcontainsitem", "args":[{"type":"field_variable","name":"LIST","variabletypes":["list"]},{"type":"input_value","name":"ITEM"}],"shape":"booleanblock"} ); };
blocks["%1 contains %2?"] = function (ctx, visitor) {
    let argType = visitor.getType(ctx.argument[0]);
    if (argType === 'choice') {
        return listContains(ctx, visitor);
    }
    return operatorContains(ctx, visitor);

};


let operatorLengthOf=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"operator_length", "args":[{"type":"input_value","name":"STRING"}],"shape":"reporterblock"} ); };
let listLengthOf=function(ctx,visitor){return listBlockConverter(ctx, visitor, { "type":"data_lengthoflist", "args":[{"type":"field_variable","name":"LIST","variabletypes":["list"]}],"shape":"reporterblock"} ); };

blocks["length of %1"] = function(ctx, visitor) {
    let argType = visitor.getType(ctx.argument[0]);
    if (argType === 'choice') {
        return listLengthOf(ctx, visitor);
    }
    return operatorLengthOf(ctx, visitor);

};

let motionGoTo=function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"motion_goto", "args":[{"type":"input_value","name":"TO","menu":"motion_goto_menu"}],"shape":"statement"} ); };
let looksGoTo =function(ctx,visitor){return universalBlockConverter(ctx, visitor, { "type":"looks_gotofrontback", "args":[{"type":"field_dropdown","name":"FRONT_BACK","options":[["front","front"],["back","back"]]}],"shape":"statement"} ); };

blocks["go to %1"] = function(ctx, visitor) {
    let argType = visitor.getString(ctx.argument[0]);
    if (argType === 'front' || argType === 'back') {
        return looksGoTo(ctx, visitor);
    }
    return motionGoTo(ctx, visitor);

};