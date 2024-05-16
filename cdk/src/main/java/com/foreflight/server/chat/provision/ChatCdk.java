package com.foreflight.server.chat.provision;

import com.foreflight.server.chat.provision.stack.ChatServerStack;
import com.foreflight.server.provision.starter.FFAppContext;
import com.foreflight.server.provision.starter.FFProvisioningApp;
import com.foreflight.server.provision.starter.FFProvisioningSupplier;

public class ChatCdk implements FFProvisioningSupplier {
    private static final String AWS_TAG_TEAM = "chat";

    public static void main(final String[] args) {
        FFProvisioningApp.run(new ChatCdk());
    }

    @Override
    public void createStacks(FFAppContext context) {
        new ChatServerStack(context, "chat-server");
    }

    @Override
    public String getTagTeamName() {
        return AWS_TAG_TEAM;
    }

    @Override
    public String getTagTeamSubOrgName() {
        return getTagTeamName();
    }
}

