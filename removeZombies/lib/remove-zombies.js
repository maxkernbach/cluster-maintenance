let file;

(function() {
  if (0 < ARGUMENTS.length) {
    file = ARGUMENTS[0];
  } else {
    print("usage: remove-zombies.sh --server.endpoint LEADER-AGENT ZOMBIE-FILE");
    return;
  }

  try {
    let role = db._version(true).details.role;

    if (role === "AGENT") {
      let agency = arango.POST('/_api/agency/read', [
        ["/"]
      ]);

      if (agency.code === 307) {
        print("you need to connect to the leader agent");
        return;
      }
    } else {
      print("you need to connect to the leader agent, not a " + role);
      return;
    }
  } catch (e) {
    print("FATAL: " + e);
    return;
  }

  // imports
  const fs = require('fs');
  const _ = require('underscore');

  let zombies;

  try {
    zombies = JSON.parse(fs.read(file));
  } catch (e) {
    print("FATAL: " + e);
    return;
  }

  _.each(zombies, function(zombie) {
    if (zombie.database.length > 0 && zombie.cid.length > 0) {
      print("removing zombie collection: " + zombie.database + "/" + zombie.cid);

      data = {};
      data['/arango/Plan/Collections/' + zombie.database + '/' + zombie.cid] = {
        'op': 'delete'
      };

      pre = {};
      pre['/arango/Plan/Collections/' + zombie.database + '/' + zombie.cid] = {
        'old': zombie.data
      };
      
      let res = arango.POST('/_api/agency/write', JSON.stringify([[data, pre]]));

      if (res.results[0] === 0) {
        print("WARNING: pre-condition failed, maybe cleanup already done");
      } else {
        print("INFO: " + JSON.stringify(res));
      }
    } else {
      print("ERROR: corrupted entry in zombie file: " + JSON.stringify(zombie));
    }
  });
}());
